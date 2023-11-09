 export const handle_regex = (username,email) => {
  const email_regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

  if (username.length < 4) {
    const return_value = {
      value: false,
      message: "lo username deve contare almeno 4 caratteri",
    };
    return return_value;
  }
  if (!email_regex.test(email)) {
    const return_value = {
      value: false,
      message: "inserisca un email valida",
    };
    return return_value;
  }
  const return_value = {
    value : true,
    message : "ok"
  }
  return return_value;
};

export  default handle_regex
