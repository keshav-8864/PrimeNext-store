
import { Show, SignInButton, SignUpButton, UserButton,useAuth } from '@clerk/react'
import PageLoader from "./components/PageLoader";
import Layout from "./components/Layout";

function App() {

 const { isLoaded} = useAuth();

  if (!isLoaded) return <PageLoader />;
  return (
    <Layout>
      <header>
        <Show when="signed-out">
          <SignInButton />
          <SignUpButton />
        </Show>
        <Show when="signed-in">
          <UserButton />
        </Show>
      </header>
      <button className='btn btn-primary'>click me</button>
    </Layout>
  )
}

export default App