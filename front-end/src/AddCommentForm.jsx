import { useState } from 'react';

export default function AddCommentForm({ onAddComment }) {
    const [nameText, setNameText] = useState('');
    const [commentText, setCommentText] = useState('');

    return(
        <>
            <div className='add_comment_box'>
                <div className="form-group">
                    <label htmlFor="name">
                        Name:
                    </label> 
                    <input type="text" name="name" value={nameText} onChange={(e) => setNameText(e.target.value)}/>
                </div>
                <div className="form-group">
                    <label htmlFor="comment">
                        Comment:
                    </label> 
                    <input type="text" name="comment" value={commentText} onChange={(e) => setCommentText(e.target.value)}/>
                </div> 
                <button type="button" onClick={() => onAddComment({ nameText, commentText })}>Add Comment</button>
            </div>
        </>
    );
}