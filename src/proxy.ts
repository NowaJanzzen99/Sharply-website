import { NextResponse, type NextRequest } from "next/server";
import { DEFAULT_LANG, LANGS } from "@/content/types";

/** Send bare paths to the visitor's own language, defaulting to Dutch. */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasLang = LANGS.some(
    (lang) => pathname === `/${lang}` || pathname.startsWith(`/${lang}/`),
  );
  if (hasLang) return NextResponse.next();

  const header = request.headers.get("accept-language") ?? "";
  const prefersEnglish = header
    .split(",")
    .map((part) => part.trim().split(";")[0].toLowerCase())
    .some((tag) => tag === "en" || tag.startsWith("en-"));

  const target = prefersEnglish ? "en" : DEFAULT_LANG;
  const url = request.nextUrl.clone();
  url.pathname = `/${target}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!api|_next|images|favicon.ico|.*\\..*).*)"],
};
