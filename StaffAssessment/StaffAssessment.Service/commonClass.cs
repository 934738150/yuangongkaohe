using SqlServerDataAdapter;
using StaffAssessment.Infrastructure.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;

namespace StaffAssessment.Service
{
    public class commonClass
    {  
        public static DataTable GetStaffInfoTable(string mOrganizationID)
        {
            string connectionString = ConnectionStringFactory.NXJCConnectionString;
            ISqlServerDataFactory factory = new SqlServerDataFactory(connectionString);
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
                          and [OrganizationID] like @mOrganizationID+'%'
                          order by convert(int,[StaffInfoID]) ";
            SqlParameter para = new SqlParameter("@mOrganizationID", mOrganizationID);
            DataTable dt = factory.Query(mySql, para);
            return dt;
        }
        public static DataTable GetStaffInfoTable(string mProductionId, string mWorkingSectionID)
        {
            string connectionString = ConnectionStringFactory.NXJCConnectionString;
            ISqlServerDataFactory factory = new SqlServerDataFactory(connectionString);
            string mySql = @"SELECT A.[StaffID] as id
                                    ,A.[StaffID]+' '+B.[Name] as text
                                    ,B.[Name]
                            FROM [dbo].[shift_staffSignInRecord] A,[dbo].[system_StaffInfo] B
                            where A.[StaffID]=B.[StaffInfoID]
                            and A.[OrganizationID] = @mProductionId
                            and A.[WorkingSectionID] =@mWorkingSectionID
                            group by A.[StaffID],B.[Name]
                            union
                            SELECT convert(int,0) as id, '全部' as [text],'' as [Name]
                            order by convert(int,[StaffID])";
            SqlParameter[] para = { new SqlParameter("@mProductionId", mProductionId) ,
                                  new SqlParameter("@mWorkingSectionID", mWorkingSectionID) 
                                  };
            DataTable dt = factory.Query(mySql, para);
            return dt;
        }
        public static DataTable GetProductionNameList(string mOrganizationID)
        {
            string connectionString = ConnectionStringFactory.NXJCConnectionString;
            ISqlServerDataFactory factory = new SqlServerDataFactory(connectionString);
            string mySql = @"SELECT [ID]
                                  ,[OrganizationID]
                                  ,[LevelCode]
                                  ,[DatabaseID]
                                  ,[Name] as text
                                  ,[Type]
                                  ,[LevelType]
                                  ,[CoefficientAltitude]
                                  ,[RawToClinkerCoff]
                                  ,[ENABLED]
                                  ,[LegalRepresentative]
                                  ,[Address]
                                  ,[Contacts]
                                  ,[ContactInfo]
                                  ,[CommissioningDate]
                                  ,[Products]
                                  ,[Remarks]
                              FROM [dbo].[system_Organization]
                              where OrganizationID like @mOrganizationID+'%'
                              and ENABLED=1
                              order by LevelCode ";
            SqlParameter para = new SqlParameter("@mOrganizationID", mOrganizationID);
            DataTable dt = factory.Query(mySql, para);
            return dt;
        }
        public static DataTable GetWorkingSectionList(string mOrganizationID) 
        {
            string connectionString = ConnectionStringFactory.NXJCConnectionString;
            ISqlServerDataFactory factory = new SqlServerDataFactory(connectionString);
            string mySql = @"SELECT distinct([WorkingSectionName])
                              FROM [dbo].[system_WorkingSection]
                              where [OrganizationID] like @mOrganizationID+'%'
                              order by [WorkingSectionName] desc ";
            SqlParameter para = new SqlParameter("@mOrganizationID", mOrganizationID);
            DataTable dt = factory.Query(mySql, para);
            return dt;   
        }
        public static DataTable GetWorkingSectionGridList(string mOrganizationID)
        {
            string connectionString = ConnectionStringFactory.NXJCConnectionString;
            ISqlServerDataFactory factory = new SqlServerDataFactory(connectionString);
            string mySql = @"SELECT  A.[WorkingSectionID],A.[Type]                
		                            ,A.[WorkingSectionName]
									,A.[OrganizationID]
		                            ,B.Name as OrganizationName
		                            FROM [dbo].[system_WorkingSection] A,[dbo].[system_Organization] B
		                            where A.[OrganizationID]=B.[OrganizationID]
		                            and A.Enabled=1
		                            and  A.OrganizationID like @mOrganizationID+'%'
		                            order by B.LevelCode,A.Type";
            SqlParameter para = new SqlParameter("@mOrganizationID", mOrganizationID);
            DataTable dt = factory.Query(mySql, para);
            return dt;         
        }
        public static DataTable GetAssessmentGroupGridTable()
        {
            string connectionString = ConnectionStringFactory.NXJCConnectionString;
            ISqlServerDataFactory factory = new SqlServerDataFactory(connectionString);
            string mySql = @"SELECT [GroupId]
                                  ,[Name]
                                  ,[StatisticalCycle]
                              FROM [dbo].[assessment_ ShiftAssessmentResultGroup]
                              order by [StatisticalCycle]";
            DataTable dt = factory.Query(mySql);
            return dt;
        }
        public static DataTable GetAssessmentCatalogueTable() {
            string connectionString = ConnectionStringFactory.NXJCConnectionString;
            ISqlServerDataFactory factory = new SqlServerDataFactory(connectionString);
            string mySql = @"SELECT [AssessmentId] 
                              ,[Name] 
                              ,[Type]
                              ,[ValueType]
                              ,[Enabled]
                          FROM [dbo].[assessment_AssessmentCatalogue]
                          where [Enabled]=1";
            DataTable dt = factory.Query(mySql);
            return dt;     
        }
    }
}
