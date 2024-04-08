import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';
const ELEVENLABS_KEY: string = process.env.ELEVENLABS_KEY as string;

export async function POST(req: NextRequest) {

	const data = await req.json();


	const speechResponse = await fetch('https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM', {
		method: 'POST',
		headers: {
			accept: "audio/mpeg",
			'xi-api-key': ELEVENLABS_KEY,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			text: data.text
		})
	});

	if (!speechResponse.ok) {
		throw new Error("Something went wrong");
	  }

	const audioData = await speechResponse.arrayBuffer();
    const audioBuffer = Buffer.from(audioData).toString('base64');


	return NextResponse.json(audioBuffer, {
		status: 200,
		headers: {
			'Access-Control-Allow-Origin': '*', // TODO : Change to tauri.localhost
			'Access-Control-Allow-Methods': 'POST, OPTIONS',
			'Access-Control-Allow-Headers': 'Content-Type, Authorization, stripeCustomerId'
		}
	});
}

export async function OPTIONS(request: Request) { 

	return new Response('Hello!', {
	  status: 200,
	  headers: {
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Methods': 'POST, OPTIONS',
		'Access-Control-Allow-Headers': 'Content-Type, Authorization, stripeCustomerId',
	  },
	})
  
  }
