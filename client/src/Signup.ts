import { ENDPOINTS } from "./Utils";

const inputEmail = document.getElementById("email");
const inputName = document.getElementById("name");
const inputPassword = document.getElementById("password");
const joinButton = document.getElementById("join");

const join = async (): Promise<void> => {
  console.log(ENDPOINTS.JOIN);
}

const init = (): void => {
  joinButton?.addEventListener("click", join);
}

init();
