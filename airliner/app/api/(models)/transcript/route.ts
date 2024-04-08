import { NextRequest, NextResponse } from "next/server";
import { Response as ReturnResponse } from "@/utils/response";

export const runtime = "edge";
const OPENAI_API_KEY: string = process.env.OPENAI_API_KEY as string;
const DUMMY_RESPONSE: boolean = process.env.DUMMY_RESPONSE === "true"; // TODO: Might pose a security risk, idk

export async function POST(req: NextRequest) {
  let response;

  if (!DUMMY_RESPONSE) {
    const formData = await req.formData();

    const result = await fetch(
      "https://api.openai.com/v1/audio/transcriptions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: formData,
      }
    );

    const transcript = await result.json();
	
    response = ReturnResponse.Success(transcript.text);
  } else {
    response = ReturnResponse.Success("Transcript disabled in server");
  }

  return NextResponse.json(response, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*", // TODO : Change to tauri.localhost
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, stripeCustomerId",
    },
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