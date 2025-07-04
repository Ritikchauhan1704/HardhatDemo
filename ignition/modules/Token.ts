import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const TokenModuler = buildModule("TokenModuler", (m) => {
  const tokenContract = m.contract("Token");
  return { tokenContract };
});

export default TokenModuler;
