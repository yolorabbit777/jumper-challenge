import dotenv from 'dotenv';
import { cleanEnv, host, num, port, str, testOnly } from 'envalid';

dotenv.config();

export const env = cleanEnv(process.env, {
  NODE_ENV: str({ devDefault: testOnly('test'), choices: ['development', 'production', 'test'] }),
  HOST: host({ devDefault: testOnly('localhost') }),
  PORT: port({ devDefault: testOnly(3000) }),
  CORS_ORIGIN: str({ devDefault: testOnly('http://localhost:3000') }),
  COMMON_RATE_LIMIT_MAX_REQUESTS: num({ devDefault: testOnly(1000) }),
  COMMON_RATE_LIMIT_WINDOW_MS: num({ devDefault: testOnly(1000) }),
  SIGN_MESSAGE: str({ devDefault: testOnly("Sign this message to verify your account ownership") }),
  JWT_SECRET: str({ devDefault: testOnly("JWT SECRET")}),
  ETHERSCAN_API_KEY: str({ devDefault: testOnly("ZNIKPZUX44B3UFE1PCK4RK8X8T3ZSICC8D")}),
  POLYGONSCAN_API_KEY: str({ devDefault: testOnly("I3WSCU6KMPCRN84JQXDS9XMJZZ2TSKWBDV")}),
  BSCSCAN_API_KEY: str({ devDefault: testOnly("MCZNN4JR4WAX6U9RRGSRUEPEXP1XI2QGWD")})
});
