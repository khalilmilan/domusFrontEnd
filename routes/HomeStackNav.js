import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialIcons } from '@expo/vector-icons';
import Home from '../screens/Home';
import Portfolio from '../screens/Portfolio';
import Listes from '../screens/event/Listes';
import Sujets from '../screens/Sujets';
import Signets from '../screens/Signets';
import Moments from '../screens/Moments';
import ProfilUpdate from '../screens/profilUpdate';
import EventDetails from '../screens/event/EventDetails';
import AddEvent from '../screens/event/AddEvent';
import EventUpdate from '../screens/event/EventUpdate';
import ForumDetails from '../screens/forum/ForumDetails';
import AddForum from '../screens/forum/AddForum';
import UpdateForum from '../screens/forum/UpdateForum';
import AddGroup from '../screens/group/AddGroup';
import UpdateGroupe from '../screens/group/UpdateGroupe';
import GroupeDetails from '../screens/group/GroupeDetails';
import AddProject from '../screens/project/AddProject';
import UpdateProject from '../screens/project/UpdateProject';
import ProjectDetails from '../screens/project/ProjectDetails';
import AddTicket from '../screens/ticket/AddTicket';
import UpdateTicket from '../screens/ticket/UpdateTicket';
import TicketDetails from '../screens/ticket/TicketDetails';
import AddSurvey from '../screens/survey/AddSurvey';
import UpdateSurvey from '../screens/survey/UpdateSurvey';
import SurveyDetails from '../screens/survey/SurveyDetails';
import SondageDetails from '../screens/survey/SondageDetails';
import AddSurveyValue from '../screens/surveyValue/AddSurveyValue';
import UpdateSurveyValue from '../screens/surveyValue/UpdateSurveyValue';
import ProjectDetailsPage from '../screens/project/ProjectDetailsPage';
import GroupePage from '../screens/group/GroupePage';
import EventsPage from '../screens/event/EventsPage';
import Discussions from '../screens/Discussions';
import ChatScreen from '../screens/ChatScreen';
import NewDiscussionModal from '../components/discussion/NewDiscussionModal';
import EventListScreen from '../screens/event/EventListScreen';
import EventsListScreen from '../screens/event/EventsListScreen';
import DatePickerComponent from '../screens/event/DateTimePicker';
import EventForm from '../screens/event/EventForm';
import EventDetailsScreen from '../screens/event/EventDetailsScreen';
import ListForum from '../screens/forum/ListForum';
import ListTicket from '../screens/ticket/ListTicket';
import ListSurveyValue from '../screens/surveyValue/ListSurveyValue';
import SurveyResultScreen from '../screens/survey/SurveyResultScreen';
import TeamChatScreen from '../screens/TeamChatScreen';
import ConversationsScreen from '../screens/ConversationsScreen';
import ConversationList from '../screens/ConversationList';
import Inscription from './Inscription';
import { THEME_COLOR } from '../constants';

const HomeStack = createStackNavigator();

const HomeStackScreen = ({ navigation }) => {
    const option = {
        title: "",
        headerStyle: {
            backgroundColor: THEME_COLOR,
        }
    }
    return (
        <HomeStack.Navigator
            screenOptions={{
                headerLeft: () => (
                    <MaterialIcons
                        name="menu"
                        size={24}
                        color="black"
                        onPress={() => navigation.openDrawer()}
                    />
                )
            }}
        >
            <HomeStack.Screen name="Home" component={Home} options={{ title: "Acceuil" }} />
            <HomeStack.Screen name="Profil" component={Portfolio} options={{
                title: "",
                headerStyle: {
                    backgroundColor: "#3d3b8f",
                }
            }} />
            <HomeStack.Screen name="Listes" component={Listes} options={option} />
            <HomeStack.Screen name="Sujets" component={Sujets} options={option} />
            <HomeStack.Screen name="Signets" component={Signets} options={option} />
            <HomeStack.Screen name="Moments" component={Moments} options={option} />
            <HomeStack.Screen name="profilUpdate" component={ProfilUpdate} options={option} />
            <HomeStack.Screen name="EventDetails" component={EventDetails} options={option} />
            <HomeStack.Screen name="AddEvent" component={AddEvent} options={option} />
            <HomeStack.Screen name="EditEvent" component={EventUpdate} options={option} />
            <HomeStack.Screen name="ForumDetails" component={ForumDetails}
                options={{
                    title: "",
                    headerStyle: {
                        backgroundColor: "#4a90e2",
                    }
                }} />
            <HomeStack.Screen name="AddForum" component={AddForum}
                options={option}
            />
            <HomeStack.Screen name="UpdateForum" component={UpdateForum} options={{ title: "Update Forum" }} />
            <HomeStack.Screen name="AddGroupe" component={AddGroup} options={option} />
            <HomeStack.Screen name="UpdateGroupe" component={UpdateGroupe} options={option} />
            <HomeStack.Screen name="GroupeDetails" component={GroupeDetails} options={option} />
            <HomeStack.Screen name="AddProject" component={AddProject} options={option} />
            <HomeStack.Screen name="UpdateProject" component={UpdateProject} options={option} />
            <HomeStack.Screen name="ProjectDetails" component={ProjectDetails} options={option} />
            <HomeStack.Screen name="AddTicket" component={AddTicket} options={option} />
            <HomeStack.Screen name="UpdateTicket" component={UpdateTicket} options={option} />
            <HomeStack.Screen name="TicketDetails" component={TicketDetails} options={option} />
            <HomeStack.Screen name="AddSurvey" component={AddSurvey} options={option} />
            <HomeStack.Screen name='UpdateSurvey' component={UpdateSurvey} options={{ title: "Update Survey" }} />
            <HomeStack.Screen name="SurveyDetails" component={SurveyDetails} options={option} />
            <HomeStack.Screen name="SondageDetails" component={SondageDetails} option={{ title: "sondage Details" }} />
            <HomeStack.Screen name="AddSurveyValue" component={AddSurveyValue} options={option} />
            <HomeStack.Screen name="ProjectDetailsPage" component={ProjectDetailsPage} option={{ title: "project details" }} />
            <HomeStack.Screen name="GroupePage" component={GroupePage} option={{ title: "groupe page" }} />
            <HomeStack.Screen name="UpdateSurveyValue" component={UpdateSurveyValue} options={option} />
            <HomeStack.Screen name="EventsPage" component={EventsPage} option={{ title: "EventsPage" }} />
            <HomeStack.Screen name="Discussions" component={Discussions} options={option} />
            <HomeStack.Screen name="ChatScreen" component={ChatScreen} options={option} />
            <HomeStack.Screen name="NewDiscussionModal" component={NewDiscussionModal} />
            <HomeStack.Screen name="Event_screen" component={EventListScreen} />
            <HomeStack.Screen name="EventForm" component={EventForm} />
            <HomeStack.Screen name="EventList" component={DatePickerComponent} />
            <HomeStack.Screen name="EventDetailsScreen" component={EventDetailsScreen} />
            <HomeStack.Screen name="ListForum" component={ListForum} options={option} />
            <HomeStack.Screen name="ListTicket" component={ListTicket} options={option} />
            <HomeStack.Screen name="ListSurveyValue" component={ListSurveyValue} options={option} />
            <HomeStack.Screen name="SurveyResultScreen" component={SurveyResultScreen} />
            <HomeStack.Screen name="TeamChatScreen" component={TeamChatScreen} />
            <HomeStack.Screen name="ConversationList" component={ConversationList} />
            <HomeStack.Screen name="Inscription" component={Inscription} />
        </HomeStack.Navigator>
    )
}

export default HomeStackScreen;