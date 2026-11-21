"use client"
import { Amplify } from 'aws-amplify';
import awsExports from './aws-exports';
import '@aws-amplify/ui-react/styles.css';
import { Authenticator } from "@aws-amplify/ui-react";
import DonzaionNavbar from './navbar';
import 'bootstrap/dist/css/bootstrap.min.css';


Amplify.configure({ ...awsExports });

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <Authenticator.Provider>
      <DonzaionNavbar />
      <html lang="en" data-scroll-behavior="smooth">
        <body>
          {children}
        </body>
      </html>
    </Authenticator.Provider>
  );
}


// <div className="App">

// </div>

// <div>
//     <p>Welcome {user.username}</p>
//     <button onClick={signOut}>Sign out</button>
// </div>


    // <Authenticator.Provider>
    //   <BrowserRouter>
    //     <Routes>
    //       <Route path="/" element={<Home/>} />
    //       {/* <Route path="/page" element={<Page/>} /> */}
    //       <Route path="/login" element={<Login/>} />
    //     </Routes> 
    //   </BrowserRouter>
    // </Authenticator.Provider>