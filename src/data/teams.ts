import { apiCall } from '../utils/networking';
import type { ITeam } from '../types';

function isITeam (arg: any): arg is ITeam {
  return (
    typeof arg.iconUrl === 'string' &&
    typeof arg.name === 'string' &&
    typeof arg.id === 'string' &&
    Array.isArray(arg.channels)
  )
}

function assertIsTypedArray<T>(arg: any, check: (val: any) => val is T): asserts arg is T[] {
  if (!Array.isArray(arg)) throw new Error(`Not an Error: ${JSON.stringify(arg)}`);
  if(arg.some(item => !check(item))) throw new Error(`Violators found: ${JSON.stringify(arg)}`);
}

let cachedAllTeamsList: Promise<ITeam[]>;
export async function getAllTeams(): Promise<ITeam[]> {
  if (typeof cachedAllTeamsList === 'undefined')
    cachedAllTeamsList = apiCall('teams').then(raw => {
      assertIsTypedArray(raw, isITeam);
      return raw;
    });

  return await cachedAllTeamsList;
}

const cachedTeamRecords: Record<string, Promise<ITeam>> = {};

export async function getTeamById(id: string): Promise<ITeam> {
  let cached = cachedTeamRecords[id];
  if (typeof cached === 'undefined')
    cached = cachedTeamRecords[id] = apiCall(`teams/${id}`);
  return await cached;
}
