import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';


export default function CreateAccountPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    async function createAccount(){
        try{

            if(password !== confirmPassword){
                setError(`Password don't match`);
                return;
            }

            await createUserWithEmailAndPassword(getAuth(), email, password);
            navigate('/articles');
        } catch(e){
            setError(e.message);
        }
    }

    return (

        <div>
            <h1>Login Account</h1>
            {error && <p style={{color: "red"}}>{error}</p>}
            <div className="login-form-container">
                <input type='text' value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Your Email'/>
                <input type='password' value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Your Password'/>
                <input type='password' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder='Your Password'/>
                <button onClick={createAccount}>Log in</button>
                <Link to='/login'>Already have an account? Login here..</Link>
            </div>
        </div>

    );
}