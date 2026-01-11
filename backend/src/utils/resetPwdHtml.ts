export const resetPwdHTML = (link: string) => `

<style>
  * {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
  }
  body {
    background-color: oklch(92.2% 0 0);
    height: 100%;
    width: 70%;
    margin-left: auto;
    margin-right: auto;
  }
  div {
    margin-top: 10%;
    background-color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10%;
    height: 70%;
  }
  img {
    display: block;
    margin: 50px auto 0 auto;
  }

  h1 {
    margin-top: 70px;
    font-size: 60px;
  }
  .text {
    font-size: 30px;
    text-align: center;
    font: bolder;
  }
  .btn {
    background-color: oklch(70.7% 0.165 254.624);
    border: none;
    color: white;
    font-size: larger;
    padding: 23px 15px;
    cursor: pointer;
  }
  .btn:hover {
    background-color: oklch(62.3% 0.214 259.815);
  }
  .text_2 {
    font-size: 25px;
    text-align: center;
    color: oklch(43.9% 0 0);
  }
</style>

<body>
  <img
    src="*"
    alt="logo"
  />
  <div>
    <h1>Password Reset</h1>
    <p class="text">
      If you've lost your password or wish to reset it, <br />
      click the link below to get started
    </p>
    <a href=${link}> <button class="btn">Reset Your password</button> </a>
    <p class="text_2">
      If you donot require a password reset, you can safely ignore this email
      only <br />
      only a person with account to your email can reset your account password
    </p>
  </div>
</body>
`;
