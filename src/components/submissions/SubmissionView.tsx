
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { FileText, Download, Check, X, MessageSquare } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface Submission {
  id: string;
  task_id: string;
  group_id: string;
  content: string;
  content_type: 'text' | 'file';
  status: 'pending' | 'approved' | 'rejected';
  feedback?: string;
  submitted_at: string;
  reviewed_at?: string;
}

interface SubmissionViewProps {
  taskId: string;
  groupId?: string;
}

export const SubmissionView: React.FC<SubmissionViewProps> = ({ taskId, groupId }) => {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState('');
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  
  const isTeacher = user?.role === 'teacher';
  
  useEffect(() => {
    const fetchSubmissions = async () => {
      setLoading(true);
      
      try {
        let query = supabase
          .from('submissions')
          .select('*')
          .eq('task_id', taskId)
          .order('submitted_at', { ascending: false });
          
        if (groupId && !isTeacher) {
          // Students can only see submissions from their group
          query = query.eq('group_id', groupId);
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        
        setSubmissions(data as Submission[]);
      } catch (error) {
        console.error('Error fetching submissions:', error);
        toast({
          title: 'Error',
          description: 'Failed to load submissions. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchSubmissions();
  }, [taskId, groupId, isTeacher]);
  
  const handleStatusChange = async (submissionId: string, newStatus: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('submissions')
        .update({ 
          status: newStatus, 
          reviewed_at: new Date().toISOString(),
          feedback: feedback || undefined
        })
        .eq('id', submissionId);
      
      if (error) throw error;
      
      // Update local state
      setSubmissions(submissions.map(sub => 
        sub.id === submissionId 
          ? { ...sub, status: newStatus, reviewed_at: new Date().toISOString(), feedback: feedback || sub.feedback } 
          : sub
      ));
      
      toast({
        title: 'Submission updated',
        description: `The submission has been ${newStatus}.`,
      });
      
      setFeedback('');
    } catch (error) {
      console.error('Error updating submission:', error);
      toast({
        title: 'Error',
        description: 'Failed to update submission status. Please try again.',
        variant: 'destructive',
      });
    }
  };
  
  const submitFeedback = async (submissionId: string) => {
    if (!feedback.trim()) return;
    
    setSubmittingFeedback(true);
    
    try {
      const { error } = await supabase
        .from('submissions')
        .update({ feedback })
        .eq('id', submissionId);
      
      if (error) throw error;
      
      // Update local state
      setSubmissions(submissions.map(sub => 
        sub.id === submissionId 
          ? { ...sub, feedback } 
          : sub
      ));
      
      toast({
        title: 'Feedback submitted',
        description: 'Your feedback has been saved.',
      });
      
      setFeedback('');
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit feedback. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSubmittingFeedback(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }
  
  if (submissions.length === 0) {
    return (
      <div className="text-center py-8">
        <FileText className="h-12 w-12 mx-auto text-gray-400" />
        <h3 className="mt-2 text-lg font-medium">No submissions yet</h3>
        <p className="text-gray-500">There are no submissions for this task yet.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Submissions</h3>
      
      <div className="space-y-4">
        {submissions.map((submission) => (
          <div 
            key={submission.id} 
            className="border rounded-lg p-4 bg-card"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FileText className="h-5 w-5 mr-2 text-blue-500" />
                <div>
                  <p className="font-medium">
                    {submission.content_type === 'file' ? 'File Submission' : 'Text Submission'}
                  </p>
                  <p className="text-sm text-gray-500">
                    Submitted on {new Date(submission.submitted_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {submission.content_type === 'file' && (
                  <a 
                    href={submission.content} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 hover:bg-gray-100 rounded-full"
                    title="Download"
                  >
                    <Download className="h-5 w-5" />
                  </a>
                )}
                
                <span className={`px-2 py-1 text-xs rounded-full ${
                  submission.status === 'approved' 
                    ? 'bg-green-100 text-green-800' 
                    : submission.status === 'rejected'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                </span>
              </div>
            </div>
            
            {submission.content_type === 'file' && (
              <div className="mt-4">
                <div className="aspect-video rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                  {submission.content.match(/\.(jpeg|jpg|gif|png)$/i) ? (
                    <img 
                      src={submission.content} 
                      alt="Submission" 
                      className="object-contain w-full h-full"
                    />
                  ) : submission.content.match(/\.(pdf)$/i) ? (
                    <iframe 
                      src={submission.content} 
                      title="PDF Submission" 
                      className="w-full h-full" 
                    />
                  ) : (
                    <div className="text-center">
                      <FileText className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                      <a 
                        href={submission.content} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        View File
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {submission.content_type === 'text' && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p>{submission.content}</p>
              </div>
            )}
            
            {submission.feedback && (
              <div className="mt-4 border-t pt-4">
                <p className="font-medium flex items-center">
                  <MessageSquare className="h-4 w-4 mr-1" />
                  Feedback
                </p>
                <p className="mt-1 text-gray-700">{submission.feedback}</p>
              </div>
            )}
            
            {isTeacher && submission.status === 'pending' && (
              <div className="mt-4 border-t pt-4">
                <div className="flex flex-col space-y-2">
                  <textarea
                    placeholder="Write feedback here..."
                    className="input-field min-h-[100px]"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                  />
                  
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => handleStatusChange(submission.id, 'rejected')}
                      className="btn-outline-destructive flex items-center"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Reject
                    </button>
                    
                    <button
                      onClick={() => handleStatusChange(submission.id, 'approved')}
                      className="btn-primary flex items-center"
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Approve
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {isTeacher && submission.status !== 'pending' && !submission.feedback && (
              <div className="mt-4 border-t pt-4">
                <div className="flex flex-col space-y-2">
                  <textarea
                    placeholder="Add feedback here..."
                    className="input-field min-h-[100px]"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                  />
                  
                  <div className="flex justify-end">
                    <button
                      onClick={() => submitFeedback(submission.id)}
                      disabled={submittingFeedback || !feedback.trim()}
                      className="btn-primary"
                    >
                      {submittingFeedback ? <LoadingSpinner size="sm" /> : 'Submit Feedback'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubmissionView;
