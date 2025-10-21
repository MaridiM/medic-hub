import { Heading, Section, Tailwind, Text } from "@react-email/components";
import { TemplateWrapper } from '../components';
import { type I18nService } from "@/core/i18n";

interface IProps {
  code: string;
  i18n?: I18nService;
  lng?: string;
}

export function OtpCodeTemplate({ code, i18n, lng = 'en' }: IProps) {
  const t = i18n.t('mail.otp_code', { lng });

  return (
    <TemplateWrapper template='otp_code' lng={lng} i18n={i18n}>
      <Tailwind>
        <Section className="font-sans text-center mb-4 px-2">
          <Heading as="h2" className="text-2xl font-bold">
            {t('title') || "Your Verification Code"}
          </Heading>
          <Text className="text-base text-gray-600">
            {t('intro') || "Use the following code to complete your verification. This code is valid for 5 minutes."}
          </Text>
        </Section>
        
        <Section className="text-center my-8">
          <Text className="inline-block bg-gray-100 px-8 py-4 rounded-lg text-4xl font-bold tracking-widest">
            {code}
          </Text>
        </Section>
      </Tailwind>
    </TemplateWrapper>
  );
}