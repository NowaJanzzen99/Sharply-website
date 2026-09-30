import { NextResponse, type NextRequest } from "next/server";
import { DEFAULT_LANG, isLang, LANGS } from "@/content/types";

/*
  Bare paths go to Dutch. Always, unless the visitor has chosen English
  themselves with the language switch, which leaves a cookie.

  An earlier version read the browser's language list and sent anyone to
  English whose list contained English anywhere. Nearly every Dutch browser
  lists English second, so nearly every Dutch visitor landed on the English
  site. Dutch is the studio's language; English is there for who asks for it.
*/
export const LANG_COOKIE = "sharply-lang";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasLang = LANGS.some(
    (lang) => pathname === `/${lang}` || pathname.startsWith(`/${lang}/`),
  );
  if (hasLang) return NextResponse.next();

  const chosen = request.cookies.get(LANG_COOKIE)?.value ?? "";
  const target = isLang(chosen) ? chosen : DEFAULT_LANG;

  const url = request.nextUrl.clone();
  url.pathname = `/${target}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!api|_next|images|favicon.ico|.*\\..*).*)"],
};
