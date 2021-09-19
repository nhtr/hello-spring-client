import { InjectionToken } from '@angular/core';

export const ACCOUNT_BASE_PATH = new InjectionToken<string>('AccountBasePath');
    export const COLLECTION_FORMATS = {
    'csv': ',',
    'tsv': '   ',
    'ssv': ' ',
    'pipes': '|'
}
