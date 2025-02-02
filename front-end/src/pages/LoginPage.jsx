import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

export default function LoginPage() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    async function LogIn(){
        try{
            await signInWithEmailAndPassword(getAuth(), email, password);
            navigate('/articles');
        } catch(e){
            setError(e.message);
        }
    }

    return (

        <div>
            <h1>Login Account</h1>
            {error && <p>{error}</p>}
            <div className="login-form-container">
                <input type='text' value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Your Email'/>
                <input type='password' value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Your Password'/>
                <button onClick={LogIn}>Log in</button>
                <Link to='/create-account'>Don't have an account? Create one here..</Link>
            </div>
        </div>

    );
}