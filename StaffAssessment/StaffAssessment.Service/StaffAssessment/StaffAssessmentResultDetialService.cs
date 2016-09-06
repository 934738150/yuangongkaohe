using SqlServerDataAdapter;
using StaffAssessment.Infrastructure.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;

namespace StaffAssessment.Service.StaffAssessment
{
    public class StaffAssessmentResultDetialService
    {
        public static DataTable GetAllAssessmentResultTable(string mProductionID, string mWorkingSectionID, string mGroupId, string mStartTime, string mEndTime, string mStatisticalCycle)
        {
            string connectionString = ConnectionStringFactory.NXJCConnectionString;
            ISqlServerDataFactory factory = new SqlServerDataFactory(connectionString);
            string mySql = @" SELECT A.[KeyId]
	                              ,B.Name as [ObjectName]
	                              ,B.[StatisticalCycle]
	                              ,CASE WHEN B.[StatisticalCycle]='day' THEN '日'
			                            WHEN B.[StatisticalCycle]='month' THEN '月'
			                            ELSE '年'
			                            END as [CycleType]
                                  ,A.[Name]
                                  ,A.[StaffID] 
                                  ,C.[Name] as [StaffName]                    
                                  ,A.[OrganizationID]
                                  ,A.[WorkingSectionID]
                                  ,A.[StartTime]
	                              ,CASE WHEN B.[StatisticalCycle]='day' THEN convert(char(10),A.[StartTime],120)
			                            WHEN B.[StatisticalCycle]='month' THEN convert(char(7),A.[StartTime],120)
			                             ELSE null
			                             END as [Time]
                                  ,A.[EndTime]
                                  ,A.[TimeStamp]
                              FROM [dbo].[tz_ShiftAssessmentResult] A,[dbo].[assessment_ ShiftAssessmentResultGroup] B,[dbo].[system_StaffInfo] C
                              where A.[GroupId]=B.[GroupId]
                              and A.[StaffID]=C.[StaffInfoID]
                              and A.[GroupId]=@mGroupId
                              and A.[OrganizationID]=@mProductionID
                              and A.[WorkingSectionID]=@mWorkingSectionID
                              and [StartTime]>=convert(datetime,@mStartTime)
                              and [StartTime]<=convert(datetime,@mEndTime)
                              order by [Time] desc ";
            SqlParameter[] para = { new SqlParameter("@mProductionID", mProductionID) ,
                                        new SqlParameter("@mWorkingSectionID", mWorkingSectionID),
                                        new SqlParameter("@mGroupId", mGroupId),
                                        new SqlParameter("@mStartTime", mStartTime),
                                        new SqlParameter("@mEndTime", mEndTime)
                                     };
                                 
            DataTable dt = factory.Query(mySql, para);
            return dt;     
        }
        public static DataTable GetAssessmentResultdetailTable(string mAssessmentId) 
        {
            string connectionString = ConnectionStringFactory.NXJCConnectionString;
            ISqlServerDataFactory factory = new SqlServerDataFactory(connectionString);
            string mySql = @"SELECT A.[Id]
                                  ,A.[AssessmentId]
	                              ,B.[Name]
                                  ,A.[ObjectId]
                                  ,A.[OrganizaitonID]
                                  ,A.[WeightedValue]
                                  ,A.[BestValue]
                                  ,A.[WorstValue]
                                  ,A.[AssessmenScore]
                                  ,A.[WeightedAverageCredit]
                              FROM [dbo].[assessment_ShiftAssessmentResultDetail] A,[dbo].[assessment_AssessmentCatalogue] B
                              where A.[AssessmentId]=B.[AssessmentId]
                               and A.KeyId=@mAssessmentId";
            SqlParameter para = new SqlParameter("@mAssessmentId", mAssessmentId);
            DataTable dt = factory.Query(mySql, para);
            return dt;    
        }

    }
}
