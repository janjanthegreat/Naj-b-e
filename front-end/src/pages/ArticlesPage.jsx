import { useState, useEffect } from 'react';
import { useParams, useLoaderData } from "react-router-dom";
import articles from "../article-content";
import axios from 'axios';
import CommentsList from "./CommentsList";
import AddCommentForm from '../AddCommentForm';
import useUser from '../useUser';
import { Link } from 'react-router-dom'; 

export default function ArticlesPage() {
    const { name } = useParams();
    const { upvotes: initialUpvote, comments: initialComment, upvoteIds: initialUpvoteIds } = useLoaderData();
    const article = articles.find(a => a.name === name);
    const [upvotes, setUpvotes] = useState(initialUpvote);
    const [comments, setComments] = useState(initialComment);
    const { isLoading, user } = useUser(); 
    const [vote, alreadyVoted] = useState(false); 
    
    // Fetch article data on component mount
    useEffect(() => {
        async function fetchArticle() {
            try {
                const response = await axios.get(`/api/articles/${name}`);
                const { upvotes, comments, upvoteIds } = response.data;
    
                // Ensure `user` is available before accessing `user.uid`
                if (user && user.uid) {
                    if (upvoteIds.includes(user.uid)) {
                        alreadyVoted(true);  // User has already voted 
                    } else {
                        alreadyVoted(false); // User has not voted 
                    }
                } else {
                    console.log('User not available yet.');
                }
    
            } catch (error) {
                console.error("Error fetching article:", error);
            }
        }
    
        // Run only when user is defined
        if (user) {
            fetchArticle();
        }
    }, [user, onUpvoteClicked]);  // Re-run when `user` changes
    

    async function onUpvoteClicked(){
        const token = user && await user.getIdToken();
        const headers = token ? { authtoken: token } : {};
        const response = await axios.post('/api/articles/' + name + '/upvote', null, { headers });
        const updatedArticleData = response.data; 
        setUpvotes(updatedArticleData.upvotes);
        console.log(user.uid);
    }

    async function onAddComment({ nameText, commentText }) {
        const token = user && await user.getIdToken();
        const headers = token ? { authtoken: token } : {};
        const response = await axios.post('/api/articles/' + name + '/comments', {
            postedBy: nameText,
            text: commentText,
        }, { headers });
        const updatedArticleData = response.data;
        setComments(updatedArticleData.comments);
    }

    return (

        <div>
            <h1>{article.name}</h1>
            { user && 
                <button onClick={onUpvoteClicked}
                disabled={vote} 
                title={vote ? "You have already voted" : "Click to upvote!"} 
                style={{
                    backgroundColor: vote ? "gray" : "#000",
                    color: "white",
                    cursor: vote ? "not-allowed" : "pointer"
                }}
                >{vote ? "You have already voted" : "Click to upvote!"} 
                </button> 
            }
            <h3>This article has { upvotes } upvotes!</h3>
            {article.content.map((p) => <p key={p}>{p}</p>)}
            { user 
                ? <AddCommentForm onAddComment={onAddComment} />
                : <Link to='/login'><h3 style={{ color: 'blue' }}>Log in to add a comment</h3></Link> 
            }
            <CommentsList comments={comments}/>
        </div>

    );
}

export async function loader({ params }){
    const response = await axios.get('/api/articles/' + params.name);
    const { upvotes, comments } = response.data;
    return { upvotes, comments };
  }