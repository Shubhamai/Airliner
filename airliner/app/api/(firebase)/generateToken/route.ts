import { NextRequest, NextResponse } from 'next/server';
import { Response } from '@/utils/response';
import { createClient } from '@supabase/supabase-js';


const supabase = createClient(	process.env.NEXT_PUBLIC_SUPABASE_URL as string,
	process.env.SUPABASE_SERVICE_ROLE_KEY as string,
   {
	auth: {
	  autoRefreshToken: false,
	  persistSession: false
	}
})
  
// Access auth admin api
const adminAuthClient = supabase.auth.admin

export async function POST(req: NextRequest) {
	const request = await req.json();


	const { data, error } = await supabase.auth.admin.generateLink({
		type: 'magiclink',
		email: request.email
	})
  
	// const token = await createCustomToken(request.uid, { expiresIn: 60 * 60 * 24 * 5 });
	// console.log(data);

	return NextResponse.json(Response.Success(data.properties?.hashed_token), {
		status: 200,
		headers: {
			'Access-Control-Allow-Origin': process.env.NODE_ENV === 'development' ? '*' : '*', // TODO : Change to tauri.localhost
			'Access-Control-Allow-Methods': 'POST',
			'Access-Control-Allow-Headers': 'Content-Type, Authorization'
		}
	});

}