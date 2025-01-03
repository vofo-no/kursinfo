export function SwitchLoader() {
  return (
    <div className="absolute w-full h-full flex flex-col items-center justify-center">
      <div className="mx-auto text-primary">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 100 100"
          width="100"
          height="100"
          className="max-w-full"
        >
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="currentColor"
            stroke-width="5"
            stroke-dasharray="60 150"
            stroke-linecap="round"
            transform="rotate(-90 50 50)"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 50 50"
              to="360 50 50"
              dur="1s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="stroke-dasharray"
              values="60 150;90 120;60 150"
              dur="1s"
              repeatCount="indefinite"
            />
          </circle>
          <circle
            cx="50"
            cy="50"
            r="30"
            fill="none"
            stroke="currentColor"
            stroke-width="3"
            stroke-dasharray="30 90"
            stroke-linecap="round"
            transform="rotate(90 50 50)"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 50 50"
              to="-360 50 50"
              dur="1.5s"
              repeatCount="indefinite"
            />
          </circle>
        </svg>
      </div>
      <p className="my-4 text-center text-muted-foreground">
        Laster studieforbund...
      </p>
    </div>
  );
}
