import ArticleList from "./ArticleList";
import articles from "../article-content";

export default function ArticlesListPage() {
    return (

        <div>
            <ArticleList articles={articles}/>
        </div>

    );
}