// WHAT: Displays list of tasks
// WHY: Reusable component that can be used on any page
// ADAPTIVE CONVERGENCE PREVIEW: Next week, this becomes DynamicTable

'use client';

import { useEffect, useState } from 'react';
import { taskAPI, Task } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function TaskList() {
  // STATE: Tasks from API
  const [tasks, setTasks] = useState<Task[]>([]);
  
  // STATE: Loading indicator
  const [loading, setLoading] = useState(true);
  
  // STATE: Error messages (separated by context)
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // Form input values (for creating new tasks)
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit mode state
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editError, setEditError] = useState<string | null>(null);

  
  /**
   * Fetch tasks when component mounts
   */
  useEffect(() => {
    fetchTasks();
  }, []);
  
  /**
   * Fetch tasks from API
   */
  async function fetchTasks() {
    try {
      setLoading(true);
      setFetchError(null);
      
      const response = await taskAPI.getAll();
      setTasks(response.results);
    } catch (err) {
      setFetchError(err instanceof Error ? err.message : 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  }

  /**
   * Handle form submission to create new task
   */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    // Validate
    if (!title.trim()) {
      setFormError('Title is required');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setFormError(null);
      
      // Create the task
      const newTask = await taskAPI.create({
        title: title.trim(),
        description: description.trim(),
        completed: false,
      });
      
      // Update local state
      setTasks([newTask, ...tasks]);
      
      // Clear form
      setTitle('');
      setDescription('');
      
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to create task');
    } finally {
      setIsSubmitting(false);
    }
  }

  /**
   * Start editing a task
   */
  function startEditing(task: Task) {
    setEditingTaskId(task.id);
    setEditTitle(task.title);
    setEditDescription(task.description);
    setEditError(null);
  }

  /**
   * Cancel editing
   */
  function cancelEditing() {
    setEditingTaskId(null);
    setEditTitle('');
    setEditDescription('');
    setEditError(null);
  }

  /**
   * Save edited task
   */
  async function saveEdit(taskId: number) {
    // Validate
    if (!editTitle.trim()) {
      setEditError('Title is required');
      return;
    }

    try {
      const updatedTask = await taskAPI.update(taskId, {
        title: editTitle.trim(),
        description: editDescription.trim(),
      });
      
      // Update local state
      setTasks(tasks.map(t => 
        t.id === taskId ? updatedTask : t
      ));
      
      // Exit edit mode
      cancelEditing();
    } catch (err) {
      setEditError(err instanceof Error ? err.message : 'Failed to update task');
    }
  }
  
  /**
   * Toggle task completion
   */
  async function toggleTask(task: Task) {
    try {
      const updatedTask = await taskAPI.update(task.id, {
        completed: !task.completed,
      });
      
      setTasks(tasks.map(t => 
        t.id === task.id ? updatedTask : t
      ));
      
    } catch (err) {
      console.error('Toggle task error:', err);
      setFetchError(err instanceof Error ? err.message : 'Failed to update task');
    }
  }

  /**
   * Delete task
   */
  async function deleteTask(id: number) {
    if (!confirm('Are you sure you want to delete this task?')) {
      return;
    }
    
    try {
      await taskAPI.delete(id);
      setTasks(tasks.filter(t => t.id !== id));
      
    } catch (err) {
      console.error('Delete task error:', err);
      setFetchError(err instanceof Error ? err.message : 'Failed to delete task');
    }
  }
  
  return (
    <div className="space-y-6">
      {/* CREATE FORM - Always visible */}
      <Card>
        <CardHeader>
          <CardTitle>Create New Task</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {formError && (
              <Alert variant="destructive">
                <AlertDescription>{formError}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Task title"
                disabled={isSubmitting}
              />
            </div>
            
            <div className="space-y-2">
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description (optional)"
                rows={3}
                disabled={isSubmitting}
              />
            </div>
            
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Task'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* TASK LIST SECTION */}
      {loading && (
        <div className="flex items-center justify-center p-8">
          <p className="text-muted-foreground">Loading tasks...</p>
        </div>
      )}
      
      {fetchError && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive">{fetchError}</p>
            <Button onClick={fetchTasks} className="mt-4">
              Try Again
            </Button>
          </CardContent>
        </Card>
      )}
      
      {!loading && !fetchError && tasks.length === 0 && (
        <div className="flex items-center justify-center p-8">
          <p className="text-muted-foreground">
            No tasks yet. Create one to get started!
          </p>
        </div>
      )}
      
      {!loading && !fetchError && tasks.length > 0 && (
        <div className="space-y-4">
          {tasks.map((task) => (
            <Card key={task.id}>
              {editingTaskId === task.id ? (
                // EDIT MODE
                <>
                  <CardHeader>
                    <CardTitle>Edit Task</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {editError && (
                      <Alert variant="destructive">
                        <AlertDescription>{editError}</AlertDescription>
                      </Alert>
                    )}
                    
                    <Input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      placeholder="Task title"
                    />
                    
                    <Textarea
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      placeholder="Description (optional)"
                      rows={3}
                    />
                    
                    <div className="flex items-center justify-end space-x-2">
                      <Button 
                        variant="outline" 
                        onClick={cancelEditing}
                      >
                        Cancel
                      </Button>
                      <Button onClick={() => saveEdit(task.id)}>
                        Save Changes
                      </Button>
                    </div>
                  </CardContent>
                </>
              ) : (
                // DISPLAY MODE
                <>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="flex items-center space-x-4 flex-1">
                      <Checkbox
                        checked={task.completed}
                        onCheckedChange={() => toggleTask(task)}
                      />
                      <CardTitle 
                        className={task.completed ? 'line-through text-muted-foreground' : ''}
                      >
                        {task.title}
                      </CardTitle>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => startEditing(task)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteTask(task.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </CardHeader>
                  {task.description && (
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        {task.description}
                      </p>
                    </CardContent>
                  )}
                </>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}