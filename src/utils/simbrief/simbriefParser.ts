// Copied from: https://github.com/flybywiresim/a32nx/blob/627b55661cb28692c7324e5aa841796a885d3d9a/fbw-a32nx/src/systems/instruments/src/EFB/SimbriefApi/simbriefParser.ts

import type { ISimbriefData } from './simbriefInterface';

const simbriefApiUrl = new URL('https://www.simbrief.com/api/xml.fetcher.php');
const simbriefApiParams = simbriefApiUrl.searchParams;

const getRequestData: RequestInit = {
	headers: { Accept: 'application/json' },
	method: 'GET'
};

export const getSimbriefData = async (simbriefUserId: string) => {
	simbriefApiParams.append('userid', simbriefUserId); // TODO: Or can use username
	simbriefApiParams.append('json', '1');
	simbriefApiUrl.search = simbriefApiParams.toString();

	const res = await fetch(simbriefApiUrl.toString(), getRequestData);
	const result = await res.json();


	if (!result.fetch.userid) {
		console.error('Simbrief API Error: ', result.fetch.error);
		return null
	} else {
		return simbriefDataParser(result);
	}
};

const simbriefDataParser = (simbriefJson: any): ISimbriefData => {
	const { general } = simbriefJson;
	const { origin } = simbriefJson;
	const { aircraft } = simbriefJson;
	const { destination } = simbriefJson;
	const { times } = simbriefJson;
	const { weights } = simbriefJson;
	const { fuel } = simbriefJson;
	const { params } = simbriefJson;
	const { alternate } = simbriefJson;
	const { files } = simbriefJson;
	const { text } = simbriefJson;
	const { weather } = simbriefJson;

	// TODO: Need to improve the key names for ChatGPT
	return {
		airline: general.icao_airline,
		flightNumber: general.flight_number,
		aircraftReg: aircraft.reg,
		cruiseAltitude: general.initial_altitude,
		costIndex: general.costindex,
		route: general.route,
		// files: { loadsheet: files.pdf.link ? files.directory + files.pdf.link : undefined },
		origin: {
			iata: origin.iata_code,
			runway: origin.plan_rwy,
			icao: origin.icao_code,
			name: origin.name,
			posLat: origin.pos_lat,
			posLong: origin.pos_long,
			metar: weather.orig_metar,
			trans_level: origin.trans_level
		},
		destination: {
			iata: destination.iata_code,
			runway: destination.plan_rwy,
			icao: destination.icao_code,
			name: destination.name,
			posLat: destination.pos_lat,
			posLong: destination.pos_long,
			metar: weather.dest_metar,
			trans_level: origin.trans_level
		},
		distance: `${general.air_distance}nm`,
		flightETAInSeconds: times.est_time_enroute,
		weights: {
			cargo: weights.cargo,
			estLandingWeight: weights.est_ldw,
			estTakeOffWeight: weights.est_tow,
			estZeroFuelWeight: weights.est_zfw,
			maxLandingWeight: weights.max_ldw,
			maxTakeOffWeight: weights.max_tow,
			maxZeroFuelWeight: weights.max_zfw,
			passengerCount: weights.pax_count_actual,
			bagCount: weights.bag_count_actual,
			passengerWeight: weights.pax_weight,
			bagWeight: weights.bag_weight,
			payload: weights.payload,
			freight: weights.freight_added
		},
		fuel: {
			avgFuelFlow: fuel.avg_fuel_flow,
			contingency: fuel.contingency,
			enrouteBurn: fuel.enroute_burn,
			etops: fuel.etops,
			extra: fuel.extra,
			maxTanks: fuel.max_tanks,
			minTakeOff: fuel.min_takeoff,
			planLanding: fuel.plan_landing,
			planRamp: fuel.plan_ramp,
			planTakeOff: fuel.plan_takeoff,
			reserve: fuel.reserve,
			taxi: fuel.taxi
		},
		units: params.units,
		alternate: {
			icao: alternate.icao_code,
			iata: alternate.iata_code,
			burn: alternate.burn
		},
		times: {
			contFuelTime: times.contfuel_time,
			destTimezone: times.dest_timezone,
			endurance: times.endurance,
			estBlock: times.est_block,
			estIn: times.est_in,
			estOff: times.est_off,
			estOn: times.est_on,
			estOut: times.est_out,
			estTimeEnroute: times.est_time_enroute,
			etopsFuelTime: times.etopsfuel_time,
			extraFuelTime: times.extrafuel_time,
			origTimeZone: times.orig_timezone,
			reserveTime: times.reserve_time,
			schedBlock: times.sched_block,
			schedIn: times.sched_in,
			schedOff: times.sched_off,
			schedOn: times.sched_on,
			schedOut: times.sched_out,
			schedTimeEnroute: times.sched_time_enroute,
			taxiIn: times.taxi_in,
			taxiOut: times.taxi_out
		}
		// weather: {
		// 	avgWindDir: general.avg_wind_dir,
		// 	avgWindSpeed: general.avg_wind_spd
		// },
		// text: text.plan_html.replace(/^<div [^>]+>/, '').replace(/<\/div>$/, '')
	};
};
