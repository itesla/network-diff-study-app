import { ShitchesStatus } from './switchesStatus';

export interface VoltageLevelDiff {
    "vl.vlId1" : string,
    "vl.vlId2" : string,
    "vl.noBus1" : number,
    "vl.noBus2" : number,
    "vl.minV1" : number,
    "vl.minV2" : number,
    "vl.minV-delta" : number,
    "vl.maxV1" : number,
    "vl.maxV2" : number,
    "vl.maxV-delta" : number,
    "vl.switchesStatusV1" : ShitchesStatus,
    "vl.switchesStatusV2" : ShitchesStatus,
    "vl.switchesStatus-delta" : [],
    "vl.isDifferent" : boolean
}