var API_URL = process.env.NEXT_PUBLIC_TRYOUT_BASE_API;

const PATH = API_URL;

// export const GETALLQUEST = PATH + '/tryout/question';
export const GETALLQUEST = PATH + '/question';
export const GETQUESTOPTIONS = PATH + '/tryout/question-option';
export const GETSHOWQUEST = PATH + '/tryout/question/';

export const GETREPORT = PATH + '/tryout/lapor-soal/create';


export const GETREGISTER = PATH + '/auth/register';
export const GETLOGIN = PATH + '/auth/login';
export const GETLOGOUT = PATH + '/auth/logout';