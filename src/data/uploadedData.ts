import { Timestamp } from 'firebase/firestore';
import { Session } from '../types';

import { v4 as uuidv4 } from 'uuid';

interface FormDataType {
  activity: string;
  date: string;
  groupType: string;
}

const generateId = (formData: FormDataType): string => {
  const activitySlug = formData.activity.trim().replace(/\s+/g, '-');
  const shortUuid = uuidv4().split('-')[0];

  const id = `${formData.date}-${activitySlug}-${formData.groupType}-${shortUuid}`;

  return id;
};