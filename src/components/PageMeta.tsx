import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";

interface PageMetaProps {
  namespace: string;
  path: string;
}

export const PageMeta = ({ namespace, path }: PageMetaProps) => {
  const { t } = useTranslation();

  return (
    <Helmet>
      <title>{t(`${namespace}.meta.title`)}</title>
      <meta name="description" content={t(`${namespace}.meta.description`)} />
      <link rel="canonical" href={`https://breakeven.dev${path}`} />
      <meta property="og:title" content={t(`${namespace}.meta.title`)} />
      <meta property="og:description" content={t(`${namespace}.meta.description`)} />
      <meta property="og:url" content={`https://breakeven.dev${path}`} />
    </Helmet>
  );
};

