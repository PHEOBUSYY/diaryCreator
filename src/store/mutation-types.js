const RENDERER = 'Renderer';

export const METHOD_GET = 'get';
export const METHOD_CREATE = 'create';
export const METHOD_DELETE = 'delete';

/**
 * IPC类型
 * @type {string}
 */
const TARGET = 'target';
export const INPUTGROUP = 'inputgroup';
export const SYSTEM = 'system';
export const TIMERECORD = 'timeRecord';

export const SENDIPC = 'sendIpc';
export const ONIPCRECEIVE = 'onipcreceive';
export const REMOVEIPC = 'removeipc';
export const COPY = 'copy';
export const AFTERSAVE = 'aftersave';
export const GETSAVE = 'getSave';
export const GETOBJ = 'getobj';
export const PRE = 'pre';
export const NEXT = 'next';
export const AUTOSAVE = 'autosave';
export const QUIT = 'quit';

export const TARGET_IPCKEY = TARGET;
export const TARGET_IPCRENDERERKEY = TARGET + RENDERER;
export const TARGET_SENDIPC = TARGET + '/' + SENDIPC;
export const TARGET_ONIPCRECEIVE = TARGET + '/' + ONIPCRECEIVE;
export const TARGET_REMOVEIPC = TARGET + '/' + REMOVEIPC;
export const TARGET_COPY = TARGET + '/' + COPY;
export const TARGET_AFTERSAVE = TARGET + '/' + AFTERSAVE;
export const TARGET_GETOBJ = TARGET + '/' + GETOBJ;
export const TARGET_GETSAVE = TARGET + '/' + GETSAVE;




export const INPUTGROUP_IPCKEY = INPUTGROUP;
export const INPUTGROUP_IPCRENDERERKEY = INPUTGROUP + RENDERER;
export const INPUTGROUP_SENDIPC = INPUTGROUP + '/' + SENDIPC;
export const INPUTGROUP_GETOBJ = INPUTGROUP + '/' + GETOBJ;
export const INPUTGROUP_ONIPCRECEIVE = INPUTGROUP + '/' + ONIPCRECEIVE;


export const ROUTER = 'router';

export const SYSTEM_IPCKEY = SYSTEM;
export const SYSTEM_IPCRENDERERKEY = SYSTEM + RENDERER;
export const SYSTEM_QUIT = SYSTEM + '/' + QUIT;
export const PRE_ROUTER = PRE + '_' + ROUTER;
export const NEXT_ROUTER = NEXT + '_' + ROUTER;
export const ONSHOW = 'onShow';
export const ONFOCUS = 'onFocus';
export const ONBLUR = 'onBlur';

export const TIMERECORD_IPCKEY = TIMERECORD;
export const TIMERECORD_IPCRENDERERKEY = TIMERECORD + RENDERER;
export const TIMERECORD_SENDIPC = TIMERECORD + '/' + SENDIPC;
export const TIMERECORD_GETOBJ = TIMERECORD + '/' + GETOBJ;
export const TIMERECORD_ONIPCRECEIVE = TIMERECORD + '/' + ONIPCRECEIVE;
export const TIMERECORD_REMOVEIPC = TIMERECORD + '/' + REMOVEIPC;