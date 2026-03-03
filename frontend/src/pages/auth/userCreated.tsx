export default function UserCreated() {
  return (
    <div className=" flex flex-col gap-5 items-center justify-center text-center font-[inter] ">
      <img
        src="https://cdn-icons-png.flaticon.com/512/7518/7518748.png"
        alt="success"
        width={200}
      />
      <h1 className="font-semibold text-3xl ">User created successfullt</h1>
      <p className=" text-lg font-medium ">
        An email verification has been sent to your gmail. Please click on it to
        continue
      </p>
    </div>
  );
}
