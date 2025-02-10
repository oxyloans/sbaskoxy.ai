import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Erice from "./components/Erice";
import RequireAuth from "./auth/RequireAuth";


// new route 
import Landingpage from "./components/Landingpage";
import Whatapplogin from "./components/Whatapplogin";
import Freerudraksha from "./components/Freerudraksh";
import FreeSample from "./components/FreeSample";
import FreeAiandGenAi from "./components/FreeAi&GenAi";
import StudyAbroad from "./components/StudyAbroad";
import MachinesManufacturingServices from "./components/Machines&ManufacturingService";
import LegalService from "./components/LegalService";
import MyRotaryServices from "./components/MyRotary";
import HiringService from "./components/HiringService";
import Layout from "./Components1/Layout";
import Sidebar from "./Pages/Sider";
import CampaignsAdd from "./Pages/CampaignsAdd";
import AllCampaignsDetails from "./Pages/AllCampaignDetail";
import FreeChatGpt from "./Components1/FreeChatGpt";
import ScrollToTop from "./components/ScrollToTop";
import TicketHistory from "./components/TicketHistory";
import UserProfile from "./components/models/ProfileCallPage";
import Normal from "./Components1/Normal";
import NormalGpt from "./Components1/NormalGpt";
import AccomidationGpt from "./Components1/GPT's/Accomadation";
import ApplicationSupport from "./Components1/GPT's/ApplicationSupport";
import AccreditationsRecognization from "./Components1/GPT's/AccreditationsRecognization";
import CoursesGpt from "./Components1/GPT's/CoursesGpt";
import PreparationGpt from "./Components1/GPT's/PreparationGpt";
import ForeignExchange from "./Components1/GPT's/ForeignExchange";
import InformationAboutCountries from "./Components1/GPT's/InformationAboutCountries";
import LoansGpt from "./Components1/GPT's/LoansGpt";
import LogisticsGpt from "./Components1/GPT's/LogisticsGpt";
import PlacementsGpt from "./Components1/GPT's/PlacementsGpt";
import QualificationSpecializationGPT from "./Components1/GPT's/QualificationSpecializationGPT";
import VisaGpt from "./Components1/GPT's/VisaGpt";
import ReviewsGpt from "./Components1/GPT's/ReviewsGpt";
import ScholarshipGpt from "./Components1/GPT's/ScholarshipGpt";
import UniversityAgents from "./Components1/GPT's/UniversityAgents";
import University from "./Components1/GPT's/UniversityGpt";
import RiceSalePage from "./components/Communities";
import AllQueriesforAdmin from "./components/UserQueries";
import Admin from "./Pages/Admin";
import QR from "./components/qr";
import CampaignDetails from "./Components1/campaignDetails";

// old route
import Dasboard from "./components/Dashboard";
import Example from "./components/Example";
import UserProfileModel from "./components/models/ProfileCallPage";
import Meeting from "./components/Meeting";
import Happy_Diwali from "./components/Happy_Diwali";
import Greenproject from "./components/Greenproject";
import EL_Dorado from "./components/EL_Dorado";
import Login from "./components/login";
import ExampleComponent from "./components/Examplecomponet";
import Vanabhojanam from "./components/Vanabhojanam";
import PresentationViewer from "./components/PresentationViewer";
import VanabhojanamSteps from "./components/VanabhojanamaSteps";
import RudrakshaSteps from "./components/RudrakshaSteps";
import Flow from "./components/Flow";
import AuthorInfo from "./components/AuthorInfo";


import Courses from "./components/GPT/Courses";
import Accomidation from "./components/GPT/Accomidation";
import FileUpload from "./Pages/FileUpload";
import Placements from "./components/GPT/Placements";
import Assistants from "./components/GPT/Assistants";
import AuthorizeandAgencies from "./components/GPT/Authorize&Agencies";
import Reviews from "./components/GPT/Reviews";
import Loans from "./components/GPT/Lonsgpt";
import Scholarship from "./components/GPT/Scholarships";
import Logistics from "./components/GPT/Logistics";
import Visa from "./components/GPT/Visa";
import AcceptanceLetter from "./components/GPT/AcceptanceLetter";
import AllQueries from "./Pages/AllQueries";
import ThankYouPage from "./components/ThankYouPage";
import BMVPDF from "./components/bmvpdf";
import BMVCOIN from "./components/Bmvcoin";
import Whatsappregister from "./components/Whatsappregister";
import Ricebags from "./kart/Mainrice";
import ItemDisplayPage from "./kart/itemsdisplay";
import MyWalletPage from "./kart/Wallet";
import CartPage from "./kart/Cart";
import MyOrders from "./kart/Myorders";
import ProfilePage from "./kart/Profile";
import SubscriptionPage from "./kart/Subscription";
import WriteToUs from "./kart/Writetous";
import TicketHistoryPage from "./kart/Tickethistory";
import ManageAddressesPage from "./kart/Address";
import CheckoutPage from "./kart/Checkout";
import PrivacyPolicy from "./kart/Privacypolicy";



const App: React.FC = () => {
  return (
    <Router>
      <ScrollToTop />
      <div className="App">
        <Routes>
          <Route path="/whatapplogin" element={<Whatapplogin />} />
          <Route
            path="/communities/landmarkresidents"
            element={<RiceSalePage />}
          />
          <Route path="/qrcode" element={<QR />} />
          {/* Landing Page (First Page) */}
          <Route path="/" element={<Landingpage />} />

          <Route path="/alluserqueries" element={<AllQueriesforAdmin />} />
          <Route path="/admin" element={<Admin />} />
          <Route
            path="/allcampaignsdetails"
            element={<AllCampaignsDetails />}
          />
          <Route path="/campaignsadd" element={<CampaignsAdd />} />
          <Route path="/sider" element={<Sidebar />} />
          <Route path="/userqueries" element={<AllQueries />} />
          {/* WhatsApp Login (Before Clicking Sign-in) */}
          <Route path="/communities/srilakshmi" element={<RiceSalePage />} />
          {/* Dashboard (After Login) */}
          <Route path="/normal" element={<Normal />}>
            <Route index element={<NormalGpt />} />
          </Route>

          <Route path="/dashboard" element={<Layout />}>
            {/* Default Route */}
            <Route index element={<FreeChatGpt />} />

            {/* Nested Routes */}
            <Route path="freerudraksha" element={<Freerudraksha />} />
            <Route path="ticket-history" element={<TicketHistory />} />
            <Route path="freesample-steelcontainer" element={<FreeSample />} />
            <Route path="freeai-genai" element={<FreeAiandGenAi />} />
            <Route path="studyabroad" element={<StudyAbroad />} />
            <Route path="free-chatgpt" element={<FreeChatGpt />} />
            <Route path="user-profile" element={<UserProfile />} />
            <Route
              path="machines-manufacturing"
              element={<MachinesManufacturingServices />}
            />
            <Route path="legalservice" element={<LegalService />} />
            <Route path="we-are-hiring" element={<HiringService />} />
            <Route path="myrotary" element={<MyRotaryServices />} />
            <Route path="accommodation-gpt" element={<AccomidationGpt />} />
            <Route
              path="applicationsupport-gpt"
              element={<ApplicationSupport />}
            />
            <Route
              path="accreditations-gpt"
              element={<AccreditationsRecognization />}
            />
            <Route path="courses-gpt" element={<CoursesGpt />} />
            <Route path="preparation-gpt" element={<PreparationGpt />} />
            <Route path="foreign-exchange" element={<ForeignExchange />} />
            <Route
              path="informationaboutcountries-gpt"
              element={<InformationAboutCountries />}
            />
            <Route path="loans-gpt" element={<LoansGpt />} />
            <Route path="logistics-gpt" element={<LogisticsGpt />} />
            <Route path="placements-gpt" element={<PlacementsGpt />} />
            <Route
              path="qualificationspecialization-gpt"
              element={<QualificationSpecializationGPT />}
            />
            <Route path="visa-gpt" element={<VisaGpt />} />
            <Route path="reviews-gpt" element={<ReviewsGpt />} />
            <Route path="scholarships-gpt" element={<ScholarshipGpt />} />
            <Route
              path="universitiesagents-gpt"
              element={<UniversityAgents />}
            />
            <Route path="universities-gpt" element={<University />} />
            <Route path="campaign/:type" element={<CampaignDetails />} />
            {/* Add more nested routes as needed */}
          </Route>

          {/* {kartpage routes} */}
          <Route path="/buyRice" element={<Ricebags />} />
          <Route path="/itemsdisplay/:itemId" element={<ItemDisplayPage />} />
          <Route path="/wallet" element={<RequireAuth><MyWalletPage /></RequireAuth>} />
          <Route path="/mycart" element={<CartPage />} />
          <Route path="/myorders" element={<RequireAuth><MyOrders /></RequireAuth>} />
          <Route path="/profile" element={<RequireAuth><ProfilePage /></RequireAuth>} />
          <Route path="/subscription" element={<RequireAuth><SubscriptionPage /></RequireAuth>} />
          <Route path="/writetous/:id" element={<RequireAuth><WriteToUs /></RequireAuth>} />
          <Route path="/writetous" element={<RequireAuth><WriteToUs /></RequireAuth>} />
          <Route path="/tickethistory" element={<RequireAuth><TicketHistoryPage /></RequireAuth>} />
          <Route path="/checkout" element={<RequireAuth><CheckoutPage /></RequireAuth>} />
          <Route path="/manageaddresses" element={<RequireAuth><ManageAddressesPage /></RequireAuth>} />
          <Route path="/privacypolicy" element={<PrivacyPolicy/>}/>
          <Route path="/bmvpdf" element={<BMVPDF />} />
          <Route path="/bmvcoin" Component={BMVCOIN} />

          {/* Redirect Unknown Routes to Landing Page */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
