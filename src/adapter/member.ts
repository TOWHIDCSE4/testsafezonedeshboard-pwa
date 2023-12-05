import { date } from 'quasar';

export const childActivities = (value: any, formatDate?: any) => {
  return Object.values(
    value.reduce(
      (
        result: any,
        {
          activityTimeStart,
          activityDisplayName,
          duration,
          activityId,
          activityType,
          activityIcon,
          questionable,
        }: {
          activityTimeStart: any;
          activityDisplayName: any;
          duration: any;
          activityId: any;
          activityType: any;
          activityIcon: any;
          questionable: any;
        }
      ) => {
        const day = date.formatDate(
          activityTimeStart,
          `${formatDate ? formatDate : 'YYYY-MM-DD'}`
        );

        if (!result[day]) {
          result[day] = {
            date: day,
            activities: [],
          };
        }

        result[day].activities.push({
          timeStart: date.formatDate(activityTimeStart, 'HH:mm A'),
          duration,
          name: activityDisplayName ? activityDisplayName : 'Apps',
          activityId,
          activityType,
          activityIcon,
          questionable,
        });
        return result;
      },
      {}
    )
  );
};

export const activitiesDashboard = (value: any) => {
  const mapGroup: any = [];
  let mapGroupData: any = [];
  value.forEach((item: any) => {
    mapGroupData = mapGroup.map((item: any) => item.activity);
    if (
      !mapGroupData.includes(item.activityDisplayName) &&
      item.activityType !== 'LOCATION'
    ) {
      mapGroup.push({
        activity: item.activityDisplayName,
        type: item.activityType,
        icon: item.activityIcon,
      });
    }
  });
  let groupData = mapGroup.map((item: any) => {
    const filter = value.filter(
      (value: any) => value.activityDisplayName === item.activity
    );
    const total = filter.reduce(
      (prev: any, { duration }: any) => prev + duration,
      0
    );
    return {
      total,
      type: item.type,
      activity: item.activity,
      icon: item.icon,
    };
  });

  return groupData;
};

export const filterBlockedWebsites = (value: any) => {
  const mapGroup: any = [];
  let mapGroupData: any = [];
  value.forEach((item: any) => {
    mapGroupData = mapGroup.map((item: any) => item.activity);
    if (
      !mapGroupData.includes(item.activityDisplayName) &&
      item.activityType === 'WEB_SURF' &&
      item.questionable === true
    ) {
      mapGroup.push({
        activity: item.activityDisplayName,
        type: item.activityType,
        icon: item.activityIcon,
      });
    }
  });
  let groupData = mapGroup.map((item: any) => {
    const filter = value.filter(
      (value: any) => value.activityDisplayName === item.activity
    );
    const total = filter.reduce(
      (prev: any, { duration }: any) => prev + duration,
      0
    );
    return {
      total,
      type: item.type,
      activity: item.activity,
      icon: item.icon,
    };
  });

  return groupData;
};
