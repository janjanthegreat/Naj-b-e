export default function CommentsList({ comments }){ 

    return(
        <>
            <h2>Comments:</h2>
            <div className="comments_container">
                 {
                    comments.map((comment) => (
                        <div className="comment" key={comment.text}>
                            <h3>{comment.postedBy}</h3>
                            <p>{comment.text}</p>
                        </div>
                    ))
                 }
            </div>
        </>
    );
}