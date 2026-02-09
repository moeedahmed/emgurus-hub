import { ukPathways } from './uk';
import { usaPathways } from './usa';
import { australiaPathways } from './australia';
import { europePathways } from './europe';
import { globalPathways } from './global';
import { singaporePathways } from './singapore';
import { canadaPathways } from './canada';
import { irelandPathways } from './ireland';
import { indiaPathways } from './india';
import { pakistanPathways } from './pakistan';
import { germanyPathways } from './germany';
import { middleEastPathways } from './middleEast';
import { newZealandPathways } from './newZealand';
import { francePathways } from './france';
import { spainPathways } from './spain';
import { italyPathways } from './italy';
import { PathwayDefinition } from '../pathwayRequirements';

export const allPathways: PathwayDefinition[] = [
    ...ukPathways,
    ...usaPathways,
    ...australiaPathways,
    ...canadaPathways,
    ...irelandPathways,
    ...indiaPathways,
    ...pakistanPathways,
    ...germanyPathways,
    ...middleEastPathways,
    ...europePathways,
    ...globalPathways,
    ...singaporePathways,
    ...newZealandPathways,
    ...francePathways,
    ...spainPathways,
    ...italyPathways,
];

export function getPathwayById(id: string): PathwayDefinition | undefined {
    // 1. Exact ID match (Preferred)
    const exact = allPathways.find(p => p.id === id);
    if (exact) return exact;

    return undefined;
}
