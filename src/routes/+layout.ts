import { supabase } from "../utils/supabase";

export const prerender = true
export const ssr = false


export async function load() {
	
    let { data: conversations, error } = await supabase
    .from('conversations')
    .select('*')

    return {
		conversations
	};
}
