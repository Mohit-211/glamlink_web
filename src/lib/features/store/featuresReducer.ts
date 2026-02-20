import { combineReducers } from '@reduxjs/toolkit';
import supportBotReducer from '../support-bot/store/supportBotSlice';
import supportMessagingReducer from '../crm/profile/support-messaging/store/supportMessagingSlice';

const featuresReducer = combineReducers({
  supportBot: supportBotReducer,
  supportMessaging: supportMessagingReducer,
});

export type FeaturesState = ReturnType<typeof featuresReducer>;

export default featuresReducer;
