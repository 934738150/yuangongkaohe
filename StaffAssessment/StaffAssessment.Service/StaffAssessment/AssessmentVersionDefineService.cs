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
    public class AssessmentVersionDefineService
    {
        public static DataTable GetAssessmentVersionDefine(string mOrganizationId)
        {
            string connectionString = ConnectionStringFactory.NXJCConnectionString;
            ISqlServerDataFactory factory = new SqlServerDataFactory(connectionString);
            string mySql = @"SELECT A.[KeyId]
                              ,A.[Name]
                              ,A.[Type]
	                          ,B.[Name] as [OrganizationName]
                              ,A.[OrganizationID]
	                          ,C.[WorkingSectionName]
                              ,A.[WorkingSectionID]
                              ,A.[Remark]
                              ,A.[Creator]
                              ,A.[CreateTime]
                          FROM [dbo].[tz_Assessment] A,[dbo].[system_Organization] B,[dbo].[system_WorkingSection] C
                          where A.[OrganizationID]=B.[OrganizationID]
                          and A.[WorkingSectionID]=C.[WorkingSectionID]
                          and A.[OrganizationID]=@mOrganizationId";
            SqlParameter para = new SqlParameter("@mOrganizationId", mOrganizationId);
            DataTable table = factory.Query(mySql, para);
            return table;          
        }
        public static DataTable GetAssessmentVersionDefine(string mProductionID, string mWorkingSectionID)
        {
            string connectionString = ConnectionStringFactory.NXJCConnectionString;
            ISqlServerDataFactory factory = new SqlServerDataFactory(connectionString);
            string mySql = @" SELECT A.[KeyId]
                              ,A.[Name]
                              ,A.[Type]
	                          ,B.[Name] as [OrganizationName]
                              ,A.[OrganizationID]
	                          ,C.[WorkingSectionName]
                              ,A.[WorkingSectionID]
                              ,A.[Remark]
                              ,A.[Creator]
                              ,A.[CreateTime]
                          FROM [dbo].[tz_Assessment] A,[dbo].[system_Organization] B,[dbo].[system_WorkingSection] C
                          where A.[OrganizationID]=B.[OrganizationID]
                          and A.[WorkingSectionID]=C.[WorkingSectionID]
                          and A.[OrganizationID]=@mProductionID
                          and A.[WorkingSectionID]=@mWorkingSectionID";
            SqlParameter[] para = { 
                                    new SqlParameter("@mProductionID", mProductionID) ,
                                    new SqlParameter("@mWorkingSectionID", mWorkingSectionID)
                                     };
            DataTable table = factory.Query(mySql, para);
            return table;
        }
        public static int ToAddAssessmentVersion(string mProductionID, string mWorkingSectionID, string mName, string mType, string mCreator, string mRemark)
        {
            string connectionString = ConnectionStringFactory.NXJCConnectionString;
            ISqlServerDataFactory factory = new SqlServerDataFactory(connectionString);
            string mySql = @"INSERT INTO [dbo].[tz_Assessment]
                           ([KeyId]
                           ,[Name]
                           ,[Type]
                           ,[OrganizationID]
                           ,[WorkingSectionID]
                           ,[Remark]
                           ,[Creator]
                           ,[CreateTime])
                     VALUES
                           (@mKeyId
                           ,@mName
                           ,@mType
                           ,@mProductionID
                           ,@mWorkingSectionID
                           ,@mRemark
                           ,@mCreator
                           ,@mTime)";
            SqlParameter[] para = { 
                                    new SqlParameter("@mKeyId", System.Guid.NewGuid().ToString()) ,
                                    new SqlParameter("@mProductionID", mProductionID) ,
                                    new SqlParameter("@mWorkingSectionID", mWorkingSectionID) ,
                                    new SqlParameter("@mName", mName) ,
                                    new SqlParameter("@mType", mType) ,
                                    new SqlParameter("@mCreator", mCreator) ,
                                    new SqlParameter("@mRemark", mRemark) ,
                                    new SqlParameter("@mTime", DateTime.Now.ToString())
                                     };
            int result = factory.ExecuteSQL(mySql,para);
            return result;
        }
        /// <summary>
        /// 编辑操作
        /// </summary>
        /// <param name="mProductionID"></param>
        /// <param name="mWorkingSectionID"></param>
        /// <param name="mName"></param>
        /// <param name="mType"></param>
        /// <param name="mCreator"></param>
        /// <param name="mRemark"></param>
        /// <param name="mKeyId"></param>
        /// <returns></returns>
        public static int ToEditAssessmentVersion(string mProductionID, string mWorkingSectionID, string mName, string mType, string mCreator, string mRemark, string mKeyId)
        {
            string connectionString = ConnectionStringFactory.NXJCConnectionString;
            ISqlServerDataFactory factory = new SqlServerDataFactory(connectionString);

            string mySql = @" UPDATE [dbo].[tz_Assessment]
                               SET [Name] = @mName
                                  ,[Type] = @mType
                                  ,[OrganizationID] = @mProductionID
                                  ,[WorkingSectionID] = @mWorkingSectionID
                                  ,[Remark] = @mRemark
                                  ,[Creator] = @mCreator
                                  ,[CreateTime] = @mTime
                             WHERE [KeyId] =@mKeyId";
            SqlParameter[] para = { 
                                    new SqlParameter("@mKeyId", mKeyId) ,
                                    new SqlParameter("@mProductionID", mProductionID) ,
                                    new SqlParameter("@mWorkingSectionID", mWorkingSectionID) ,
                                    new SqlParameter("@mName", mName) ,
                                    new SqlParameter("@mType", mType) ,
                                    new SqlParameter("@mCreator", mCreator) ,
                                    new SqlParameter("@mRemark", mRemark) ,
                                    new SqlParameter("@mTime", DateTime.Now.ToString())
                                     };
            int result = factory.ExecuteSQL(mySql, para);
            return result;
        }
        public static DataTable GetAssessmentVersionDetailTable(string mKeyId) 
        {
            string connectionString = ConnectionStringFactory.NXJCConnectionString;
            ISqlServerDataFactory factory = new SqlServerDataFactory(connectionString);
            string mySql = @"SELECT A.[Id]
                              ,A.[AssessmentId]
	                          ,C.Name
                              ,A.[ObjectId]
	                          ,B.[Name] as [OrganizaitonName]
                              ,A.[OrganizaitonID]
                              ,A.[KeyId]
                              ,A.[WeightedValue]
                              ,A.[BestValue]
                              ,A.[WorstValue]
                              ,A.[Enabled]
                          FROM [dbo].[assessment_AssessmentDetail] A,[dbo].[system_Organization] B,[dbo].[assessment_AssessmentCatalogue] C
                          where A.[OrganizaitonID]=B.[OrganizationID]
                          and A.[AssessmentId]=C.[AssessmentId]
                      and A.[KeyId]=@mKeyId";
            SqlParameter para = new SqlParameter("@mKeyId", mKeyId);
            DataTable table = factory.Query(mySql, para);
            return table;          
        
        }
        public static int ToAddAssessmentDetail(string mOrganizationID, string mKeyId, string mAssessmentId, string mObjectId, string mWeightedValue, string mBestValue, string mWorstValue, string mEnabled)
        {
            string connectionString = ConnectionStringFactory.NXJCConnectionString;
            ISqlServerDataFactory factory = new SqlServerDataFactory(connectionString);
            string mySql = @"INSERT INTO [dbo].[assessment_AssessmentDetail]
                                   ([Id]
                                   ,[AssessmentId]
                                   ,[ObjectId]
                                   ,[OrganizaitonID]
                                   ,[KeyId]
                                   ,[WeightedValue]
                                   ,[BestValue]
                                   ,[WorstValue]
                                   ,[Enabled])
                             VALUES
                                   (@mId
                                   ,@mAssessmentId
                                   ,@mObjectId
                                   ,@mOrganizationID
                                   ,@mKeyId
                                   ,@mWeightedValue
                                   ,@mBestValue
                                   ,@mWorstValue
                                   ,@mEnabled)";
            SqlParameter[] para = { 
                                    new SqlParameter("@mId", System.Guid.NewGuid().ToString()) ,
                                    new SqlParameter("@mOrganizationID", mOrganizationID) ,
                                    new SqlParameter("@mKeyId", mKeyId) ,
                                    new SqlParameter("@mAssessmentId", mAssessmentId) ,
                                    new SqlParameter("@mObjectId", mObjectId) ,
                                    new SqlParameter("@mWeightedValue", mWeightedValue) ,
                                    new SqlParameter("@mBestValue", mBestValue) ,
                                    new SqlParameter("@mWorstValue", mWorstValue),
                                    new SqlParameter("@mEnabled", mEnabled)
                                     };
            int result = factory.ExecuteSQL(mySql, para);
            return result;
        }
        public static int ToEditAssessmentDetail(string mOrganizationID, string mKeyId, string mAssessmentId, string mObjectId, string mWeightedValue, string mBestValue, string mWorstValue, string mEnabled, string mId)
        {
            string connectionString = ConnectionStringFactory.NXJCConnectionString;
            ISqlServerDataFactory factory = new SqlServerDataFactory(connectionString);
            string mySql = @"UPDATE [dbo].[assessment_AssessmentDetail]
                               SET [AssessmentId] = @mAssessmentId
                                  ,[ObjectId] = @mObjectId
                                  ,[OrganizaitonID] =@mOrganizationID
                                  ,[KeyId] = @mKeyId
                                  ,[WeightedValue] = @mWeightedValue
                                  ,[BestValue] = @mBestValue
                                  ,[WorstValue] =@mWorstValue
                                  ,[Enabled] = @mEnabled
                             WHERE [Id] =@mId";
            SqlParameter[] para = { 
                                    new SqlParameter("@mId", mId) ,
                                    new SqlParameter("@mOrganizationID", mOrganizationID) ,
                                    new SqlParameter("@mKeyId", mKeyId) ,
                                    new SqlParameter("@mAssessmentId", mAssessmentId) ,
                                    new SqlParameter("@mObjectId", mObjectId) ,
                                    new SqlParameter("@mWeightedValue", mWeightedValue) ,
                                    new SqlParameter("@mBestValue", mBestValue) ,
                                    new SqlParameter("@mWorstValue", mWorstValue),
                                    new SqlParameter("@mEnabled", mEnabled)
                                     };
            int result = factory.ExecuteSQL(mySql, para);
            return result;        
        }
        public static int ToDeleteAssessmentDetail(string mId)
        { 
            string connectionString = ConnectionStringFactory.NXJCConnectionString;
                ISqlServerDataFactory factory = new SqlServerDataFactory(connectionString);
                string mySql = @"DELETE FROM [dbo].[assessment_AssessmentDetail] 
                                 WHERE [Id] =@mId";
                SqlParameter para =  new SqlParameter("@mId", mId) ;
                int result = factory.ExecuteSQL(mySql, para);
                return result;      
        }
        public static int ToDeleteAssessmentVersion(string mKeyId) {
            string connectionString = ConnectionStringFactory.NXJCConnectionString;
            ISqlServerDataFactory factory = new SqlServerDataFactory(connectionString);
            string mySql = @"
                            delete from  [dbo].[tz_Assessment] where [KeyId]=@mKeyId
                            delete from  [dbo].[assessment_AssessmentDetail] where [KeyId]=@mKeyId";
            SqlParameter para = new SqlParameter("@mKeyId", mKeyId);
            int result = factory.ExecuteSQL(mySql, para);
            return result;           
        }
    }
}
