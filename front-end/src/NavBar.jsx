import { Link, useNavigate } from "react-router-dom";
import { getAuth, signOut } from 'firebase/auth';
import useUser from "./useUser";

export default function NavBar() {

  const { isLoading, user } = useUser();

  const navigate = useNavigate();

    return (
        <nav>
            <ul className="main_nav">
                <li>
                  <Link to="/">Home</Link>  
                </li>
                <li>
                  <Link to="/about">About</Link>  
                </li>
                <li>
                  <Link to="/articles">Articles</Link>  
                </li> 
                <li>
                  {
                    isLoading 
                    ? <p style={{ color: '#fff' }}>Loading...</p> 
                    : ( user ? (
                        <div>
                          <span style={{ color: '#fff', margin: '20px' }}>Logged in as {user.email}</span>
                          <button onClick={() => signOut(getAuth())}>Sign out</button>
                        </div>
                      ) : (
                        <button onClick={() => navigate('/login')}>Log in</button>
                      )
                    )
                  }
                </li>

            </ul>
        </nav>
    );
}