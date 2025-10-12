
import { APP_NAME, COMPANY_NAME, SUPPORT_EMAIL } from "@/core/config";
import { type I18nService } from "@/core/i18n";
import {
  Body,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text
} from "@react-email/components";
import { PropsWithChildren } from "react";

type TTemplateName = 'verification_email' | 'reset_password' | 'otp_code'

export interface IProps {
  template: TTemplateName;
  i18n?: I18nService;
  lng?: string;
}

export function TemplateWrapper({ template, children, i18n, lng='en' }: PropsWithChildren<IProps>) {
    const currentYear: number = new Date().getFullYear()
    const t = i18n.t(`mail.${template}`, { lng })
    const tTemp = i18n.t(`mail.template`, { lng })

    return (
        <Html lang={lng}>
            <Preview>{t('preview')}</Preview>
            <Tailwind>
                <Head />
                <Body className="bg-[#efefef] max-w-[600px] m-auto py-3 px-3">
                    {/* Логотип */}
                    <div className="bg-white h-fit px-4 py-6 rounded-md space-y-4 text-center">
                        <Section>
                            {/*[if mso]><div style="font-family:Segoe UI, Arial, sans-serif; font-size:20px; font-weight:700; color:#143394">{companyName}</div><![endif]*/}
                            <div className="h-12 flex justify-center items-center" role="svg" aria-label={COMPANY_NAME}>
                                <Img
                                    src='https://res.cloudinary.com/dki4lxdki/image/upload/v1759181992/doctorlab/app/logo-full.png' 
                                    width="180"
                                    height="44"
                                    alt={COMPANY_NAME}
                                    style={{ display: "block", margin: "0 auto", border: "0", outline: "none", textDecoration: "none" }}
                                />
                            </div>
                        </Section>

                        {children}
                    </div>

                    <Section className="px-1 pt-4">
                        <Text className="m-0 text-xs text-[#656565]">
                         {tTemp('signature')[0] || "Regards, the"} <span className="font-semibold text-[#143394]">{tTemp('signature', {company: COMPANY_NAME})[1] || `${COMPANY_NAME} team`}</span>
                        </Text>
                        <Text className="mt-2 text-xs text-[#656565]">
                            {tTemp('supportNote') || "This is an automated message; please do not reply. Contact support: "}
                        <Link href={`mailto:${SUPPORT_EMAIL}`} className="text-[#656565] underline">
                            {SUPPORT_EMAIL}
                        </Link>
                        </Text>
                        <Text className="font-sans leading-[14px] font-normal text-[#656565] text-xs mb-2">
                            {t('legalNote', { app: APP_NAME}) || `You're receiving this email because you created a ${APP_NAME} account. If you didn’t request this, you can safely ignore this email.`}
                        </Text>
                    </Section>

                    <Section className="text-center px-2">
                        <Text className="font-sans tracking-wide font-normal text-[#656565] text-xs mb-4">{tTemp('copyright', {year: currentYear, company: APP_NAME }) || `© ${currentYear} ${APP_NAME}. All rights reserved.`}</Text>
                        {/*[if mso]><div style="font-family:Segoe UI, Arial, sans-serif; font-size:20px; font-weight:700; color:#143394">{companyName}</div><![endif]*/}
                        <div className="size-12 flex justify-center items-center  m-auto" role="img" aria-label={COMPANY_NAME}>
                            <Img
                                src='https://res.cloudinary.com/dki4lxdki/image/upload/v1759181993/doctorlab/app/logo-mini.png' 
                                width="44"
                                height="44"
                                alt={COMPANY_NAME}
                                style={{ display: "block", margin: "0 auto", border: "0", outline: "none", textDecoration: "none" }}
                            />
                        </div>
                    </Section>
                </Body>
            </Tailwind>
        </Html>
    );
}