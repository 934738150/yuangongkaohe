using SqlServerDataAdapter;
using StaffAssessment.Infrastructure.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;

namespace StaffAssessment.Service.WorkingSection
{
    public class WorkingSectionDefineService
    {
        public static DataTable GetQueryDataTable(string mOrganizationID) 
        {
            string connectionString = ConnectionStringFactory.NXJCConnectionString;
            ISqlServerDataFactory factory = new SqlServerDataFactory(connectionString);
            string mySql = @"SELECT A.[WorkingSectionItemID]
                          ,A.[WorkingSectionID]
	                      ,B.[LevelCode]
                          ,A.[WorkingSectionName]
                          ,A.[Type]
                          ,A.[OrganizationID]
	                      ,B.Name as OrganizationName
                          ,A.[DisplayIndex]
                          ,A.[ElectricityQuantityId]
                          ,A.[OutputId]
                          ,A.[CoalWeightId]
                          ,A.[Creator]
                          ,A.[CreatedTime]
                          ,A.[Enabled]
                          ,A.[Remarks]
                      FROM [dbo].[system_WorkingSection] A,[dbo].[system_Organization] B
                      where A.[OrganizationID]=B.[OrganizationID]
                      and  A.[OrganizationID] like @mOrganizationID+'%'
                      order by LevelCode,Type";
            SqlParameter para = new SqlParameter("@mOrganizationID", mOrganizationID);
            DataTable dt = factory.Query(mySql, para);
            return dt;          
        }
        public static int InsertWorkingSection(string mProductionName, string mSectionType, string mWorkingSection, string mEnabed, string mEditor, string mRemark)
        {
            string connectionString = ConnectionStringFactory.NXJCConnectionString;
            ISqlServerDataFactory factory = new SqlServerDataFactory(connectionString);

            string mySql = @"INSERT INTO [dbo].[system_WorkingSection]
                            ([WorkingSectionItemID]
                            ,[WorkingSectionID]
                            ,[WorkingSectionName]
                            ,[Type]
                            ,[OrganizationID]
                            ,[DisplayIndex]
                            ,[ElectricityQuantityId]
                            ,[OutputId]
                            ,[CoalWeightId]
                            ,[Creator]
                            ,[CreatedTime]
                            ,[Enabled]
                            ,[Remarks])
                        VALUES
                            (@mWorkingSectionItemID
                            ,@mWorkingSectionID
                            ,@mWorkingSectionName
                            ,@mType
                            ,@mOrganizationID
                            ,null
                            ,null
                            ,null
                            ,null
                            ,@mCreator
                            ,@mCreatedTime
                            ,@mEnabled
                            ,@mRemarks)";
            SqlParameter[] para = { new SqlParameter("@mWorkingSectionItemID",System.Guid.NewGuid().ToString()),
                                    new SqlParameter("@mWorkingSectionID", System.Guid.NewGuid().ToString()),
                                    new SqlParameter("@mWorkingSectionName", mWorkingSection),
                                    new SqlParameter("@mType", mSectionType),
                                    new SqlParameter("@mOrganizationID", mProductionName),
                                    new SqlParameter("@mCreator", mEditor),
                                    new SqlParameter("@mCreatedTime",DateTime.Now.ToString()),
                                    new SqlParameter("@mEnabled", mEnabed),
                                    new SqlParameter("@mRemarks", mRemark)};
            int dt = factory.ExecuteSQL(mySql, para);
            return dt;              
        }
        public static int EditWorkingSection(string mWorkingSectionID, string mProductionName, string mSectionType, string mWorkingSection, string mEnabed, string mEditor, string mRemark) 
        {
            string connectionString = ConnectionStringFactory.NXJCConnectionString;
            ISqlServerDataFactory factory = new SqlServerDataFactory(connectionString);

            string mySql = @"UPDATE [dbo].[system_WorkingSection]
                               SET [WorkingSectionName] = @mWorkingSectionName
                                  ,[Type] = @mType
                                  ,[OrganizationID] = @mOrganizationID                                 
                                  ,[Creator] = @mCreator
                                  ,[CreatedTime] = @mCreatedTime
                                  ,[Enabled] = @mEnabled
                                  ,[Remarks] = @mRemarks
                         WHERE [WorkingSectionID] =@mWorkingSectionID";
            SqlParameter[] para = { new SqlParameter("@mWorkingSectionID", mWorkingSectionID),
                                    new SqlParameter("@mWorkingSectionName", mWorkingSection),
                                    new SqlParameter("@mType", mSectionType),
                                    new SqlParameter("@mOrganizationID", mProductionName),
                                    new SqlParameter("@mCreator", mEditor),
                                    new SqlParameter("@mCreatedTime",DateTime.Now.ToString()),
                                    new SqlParameter("@mEnabled", mEnabed),
                                    new SqlParameter("@mRemarks", mRemark)};
            int dt = factory.ExecuteSQL(mySql, para);
            return dt;     
        }
        public static int deleteWorkingSection(string mWorkingSectionID) 
        {
            string connectionString = ConnectionStringFactory.NXJCConnectionString;
            ISqlServerDataFactory factory = new SqlServerDataFactory(connectionString);

            string mySql = @"delete from [dbo].[system_WorkingSection]
                         WHERE [WorkingSectionID] =@mWorkingSectionID";
            SqlParameter para =  new SqlParameter("@mWorkingSectionID", mWorkingSectionID);
            int dt = factory.ExecuteSQL(mySql, para);
            return dt;     
        }
 
    }
}
