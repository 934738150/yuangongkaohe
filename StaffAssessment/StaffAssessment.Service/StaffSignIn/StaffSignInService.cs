using SqlServerDataAdapter;
using StaffAssessment.Infrastructure.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;

namespace StaffAssessment.Service.StaffSignIn
{
   public class StaffSignInService
    {
       public static DataTable GetWorkingSectionTable(string mOrganizationID)
       {
           string connectionString = ConnectionStringFactory.NXJCConnectionString;
           ISqlServerDataFactory factory = new SqlServerDataFactory(connectionString);
           string mySql = @"SELECT '' as Signin,'' as Shift, B.[WorkingSectionItemID]
                              ,B.[WorkingSectionID]
                              ,B.[WorkingSectionName]
                              ,A.Name
                              ,B.[Type]
                              ,B.[OrganizationID]
                              ,B.[DisplayIndex]
                              ,B.[ElectricityQuantityId]
                              ,B.[OutputId]
                              ,B.[CoalWeightId]
                              ,B.[Creator]
                              ,B.[CreatedTime]
                              ,B.[Enabled]
                              ,B.[Remarks]                             
                              ,A.LevelType
                              ,A.OrganizationID
                           FROM [dbo].[system_WorkingSection] B,[system_Organization] A
                           where A.[OrganizationID] = B.[OrganizationID]
                                 and A.[OrganizationID] like @mOrganizationID+'%'
                                  order by A.Name";
           SqlParameter para = new SqlParameter("@mOrganizationID", mOrganizationID);
           DataTable dt = factory.Query(mySql, para);
           return dt;
       }
       public static DataTable GetStaffInfoTable(string mOrganizationID)
       {
           string connectionString = ConnectionStringFactory.NXJCConnectionString;
           ISqlServerDataFactory dataFactory = new SqlServerDataFactory(connectionString);
           string mySql = @"SELECT [StaffInfoID]+' '+[Name] as text
                              ,[StaffInfoID] as id
	                          ,[Name]
                              ,[OrganizationID]
                              ,[WorkingTeamName]
                              ,[WorkingSectionID]      
                              ,[Sex]
                              ,[PhoneNumber]
                              ,[Enabled]
                          FROM [dbo].[system_StaffInfo]
                          where Enabled=1
                          and [OrganizationID]=@mOrganizationID
                          order by convert(int,[StaffInfoID]) ";
           SqlParameter para = new SqlParameter("@mOrganizationID", mOrganizationID);
           DataTable dt = dataFactory.Query(mySql, para);
           return dt;
       }
       public static int Save(string mworkingId, string organizationId, string mvDate, string mShift, string mStaffID)
       {
           string connectionString = ConnectionStringFactory.NXJCConnectionString;
           ISqlServerDataFactory dataFactory = new SqlServerDataFactory(connectionString);
           string mySql = @"insert into [dbo].[shift_staffSignInRecord] (vDate,StaffID,OrganizationID,WorkingSectionID,Shifts) values
                                          (@mvDate,@mStaffID,@organizationId,@mworkingId,@mShift)";
           SqlParameter[] parameters = {
                                    new SqlParameter("@mworkingId", mworkingId),
                                    new SqlParameter("@organizationId", organizationId),
                                    new SqlParameter("@mvDate", mvDate), 
                                    new SqlParameter("@mStaffID", mStaffID),
                                    new SqlParameter("@mShift", mShift)
                                         };
           int result = dataFactory.ExecuteSQL(mySql, parameters);
           return result;
       }
       public static DataTable GetHistoryStaffSignInTable(string mOrganizationID, string mStaffId, string mStartTime, string mEndTime)
       {
           string connectionString = ConnectionStringFactory.NXJCConnectionString;
           ISqlServerDataFactory factory = new SqlServerDataFactory(connectionString);
             string  mySql = @"SELECT A.[RecordId]
                          ,A.[vDate]
                          ,A.[StaffID]
                          ,C.[Name] as StaffName
                          ,A.[OrganizationID]
                          ,A.[WorkingSectionID]
	                      ,B.[WorkingSectionName]
                          ,A.[Shifts]
                          ,A.[Creator]
                          ,A.[CreateTime]
                          ,A.[Remark] 
                  FROM [dbo].[shift_staffSignInRecord] A,[dbo].[system_WorkingSection] B,
                   [dbo].[system_StaffInfo] C
                    where A.[WorkingSectionID]=B.[WorkingSectionID]
                    and A.[StaffID]=C.[StaffInfoID]
                    and A.OrganizationID=@mOrganizationID
                    and A.[StaffID]=@mStaffId  
                    and convert(datetime,[vDate])>=convert(datetime,@mStartTime)
                    and convert(datetime,[vDate])<=convert(datetime,@mEndTime)                 
                    order by convert(datetime,[vDate])";
               SqlParameter[] parameter = { 
                                           new SqlParameter("@mOrganizationID", mOrganizationID),
                                           new SqlParameter("@mStaffId", mStaffId), 
                                            new SqlParameter("@mStartTime", mStartTime),
                                             new SqlParameter("@mEndTime", mEndTime)
                                       };
             DataTable dt = factory.Query(mySql, parameter);
           return dt;
       }
    }
}
