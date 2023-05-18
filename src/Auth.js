import {auth} from './firebase'

export const register = async({email, password})=>{
	const resp = await auth.createUserWithEmailAndPassword(email, password);
	return resp.user;
}

export const login = async({email, password})=>{
	const res = await auth.signInWithEmailAndPassword(email, password);
	return res.user;
}
