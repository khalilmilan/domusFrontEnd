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

const HomeStack = createStackNavigator();

const HomeStackScreen = ({ navigation }) => {
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
            <HomeStack.Screen name="Profil" component={Portfolio} />
            <HomeStack.Screen name="Listes" component={Listes} options={{ title: "Events" }} />
            <HomeStack.Screen name="Sujets" component={Sujets} options={{ title: "Groups" }}/>
            <HomeStack.Screen name="Signets" component={Signets} options={{ title: "Projects" }}/>
            <HomeStack.Screen name="Moments" component={Moments} options={{ title: "Surveys" }}/>
            <HomeStack.Screen name="profilUpdate" component={ProfilUpdate} />
            <HomeStack.Screen name="EventDetails" component={EventDetails} />
            <HomeStack.Screen name="AddEvent" component={AddEvent} options={{ title: "Add Event" }} />
            <HomeStack.Screen name="EditEvent" component={EventUpdate} options={{ title: "Update Event" }} />
            <HomeStack.Screen name="ForumDetails" component={ForumDetails} options={{ title: "Forum Details" }} />
            <HomeStack.Screen name="AddForum" component={AddForum} options={{ title: "Add Forum" }} />
            <HomeStack.Screen name="UpdateForum" component={UpdateForum} options={{ title: "Update Forum" }} />
            <HomeStack.Screen name="AddGroupe" component={AddGroup} options={{ title: "Add Groupe" }} />
            <HomeStack.Screen name="UpdateGroupe" component={UpdateGroupe} options={{ title: "Update Groupe" }} />
            <HomeStack.Screen name="GroupeDetails" component={GroupeDetails} options={{ title: "Groupe Details" }} />
            <HomeStack.Screen name="AddProject" component={AddProject} options={{ title: "Add Project" }} />
            <HomeStack.Screen name="UpdateProject" component={UpdateProject} options={{ title: "Update Project" }} />
            <HomeStack.Screen name="ProjectDetails" component={ProjectDetails} options={{ title: "Project Details" }} />
            <HomeStack.Screen name="AddTicket" component={AddTicket} options={{ title: "Add Ticket" }} />
            <HomeStack.Screen name="UpdateTicket" component={UpdateTicket} options={{ title: "Update Ticket" }} />
            <HomeStack.Screen name="TicketDetails" component={TicketDetails} options={{ title: "Ticket Details" }} />
            <HomeStack.Screen name="AddSurvey" component={AddSurvey} options={{ title: "Add Survey" }} />
            <HomeStack.Screen name='UpdateSurvey' component={UpdateSurvey} options={{title:"Update Survey"}}/>
            <HomeStack.Screen name="SurveyDetails" component={SurveyDetails} option={{title: "Survey Details"}}/>
            <HomeStack.Screen name="SondageDetails" component={SondageDetails} option={{title: "sondage Details"}}/>
            <HomeStack.Screen name="AddSurveyValue" component={AddSurveyValue} option={{title: " Add Survey value"}}/>
            <HomeStack.Screen name="ProjectDetailsPage" component={ProjectDetailsPage} option={{title: "project details"}}/>
            <HomeStack.Screen name="GroupePage" component={GroupePage} option={{title: "groupe page"}}/>
            <HomeStack.Screen name="UpdateSurveyValue" component={UpdateSurveyValue} option={{title: "Update Survey Value"}}/>
            <HomeStack.Screen name="EventsPage" component={EventsPage} option={{title: "EventsPage"}}/>
            <HomeStack.Screen name="Discussions" component={Discussions} option={{title: "Discussions"}}/>
        
        </HomeStack.Navigator>
    )
}

export default HomeStackScreen;