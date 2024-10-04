import {
  Html,
  Head,
  Font,
  Preview,
  Heading,
  Row,
  Section,
  Text,
  Button,
} from "@react-email/components";
import * as React from "react";

export interface SendOTPMailProps {
  name: string;
  email: string;
  password: string;
}

export default function SendCredentialEmail(props: SendOTPMailProps) {
  return (
    <Html lang="en">
      <Head>
        <Font
          fontFamily="Roboto"
          fallbackFontFamily="Verdana"
          webFont={{
            url: "https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Section>
        <Row>
          <Heading>Hi {props.name},</Heading>
        </Row>
        <Row>
          <Text>
            Your username is {props.email} and your password is {props.password}
          </Text>
        </Row>
      </Section>
    </Html>
  );
}
