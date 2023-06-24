import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import LogIn from "./components/LogIn";
import SignUp from "./components/SignUp";
import Policy from "./pages/Policy";
import Chat from "./pages/Chat";
import Help from "./pages/Help";
import FAQ from "./pages/FAQ";
import PasswordResetForm from "./components/PasswordResetForm";
import UserNameForget from "./components/UserNameForget";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/signin" element={<LogIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/password" element={<PasswordResetForm />} />
          <Route path="/username" element={<UserNameForget />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/policy" element={<Policy />} />
          <Route path="/help" element={<Help />} />
          <Route path="/faq" element={<FAQ />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
