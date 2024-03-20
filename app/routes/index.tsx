import { createRoute } from "honox/factory";
import logoUrl from "../assets/images/logo_portrait.svg";
import Button from "../components/common/Button";
import LandingPageLayout from "../components/layout/LandingPage";
import { site } from "../libs/constants";

export default createRoute((c) => {
  return c.render(
    <LandingPageLayout>
      <div className="max-w-[26rem]">
        <img className="m-auto" width={256} src={logoUrl} alt={site.name} />
        <h1 className="mt-10 text-3xl md:text-4xl tracking-wide text-center">
          {site.description.short}
        </h1>
        <p className="mt-6">{site.description.long}</p>
        <Button asChild>
          <a className="block mx-auto mt-10 text-base" href="/">
            <span className="font-noto-emoji">🐙</span>
            <span className="ml-2">新規登録 or ログイン</span>
          </a>
        </Button>
      </div>
    </LandingPageLayout>,
    {
      title: `${site.name} | ${site.description.short}`,
    },
  );
});
