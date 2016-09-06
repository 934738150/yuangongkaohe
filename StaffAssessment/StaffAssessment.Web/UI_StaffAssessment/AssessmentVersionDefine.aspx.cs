using StaffAssessment.Service;
using StaffAssessment.Service.StaffAssessment;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Services;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace StaffAssessment.Web.UI_StaffAssessment
{
    public partial class AssessmentVersionDefine : WebStyleBaseForEnergy.webStyleBase
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            base.InitComponts();
            if (!IsPostBack)
            {
#if DEBUG
                ////////////////////调试用,自定义的数据授权
                List<string> m_DataValidIdItems = new List<string>() { "zc_nxjc_byc_byf" };
                AddDataValidIdGroup("ProductionOrganization", m_DataValidIdItems);
#elif RELEASE
#endif
                this.OrganisationTree_ProductionLine.Organizations = GetDataValidIdGroup("ProductionOrganization");                         //向web用户控件传递数据授权参数
                this.OrganisationTree_ProductionLine.PageName = "AssessmentVersionDefine.aspx";   //向web用户控件传递当前调用的页面名称
                this.OrganisationTree_ProductionLine.LeveDepth = 5;
            }
        }
        [WebMethod]
        public static string GetWorkingSectionGrid(string mOrganizationId)
        {
            DataTable table = commonClass.GetWorkingSectionGridList(mOrganizationId);
            string json = EasyUIJsonParser.DataGridJsonParser.DataTableToJson(table);
            return json;
        }
        [WebMethod]
        public static string GetAssessmentVersionDefineByOrganization(string mOrganizationId) 
        {
            DataTable table = AssessmentVersionDefineService.GetAssessmentVersionDefine(mOrganizationId);
            string json = EasyUIJsonParser.DataGridJsonParser.DataTableToJson(table);
            return json;
        }
        [WebMethod]
        public static string GetAssessmentVersionDefineByWorkingSection(string mProductionID, string mWorkingSectionID)
        {
            DataTable table = AssessmentVersionDefineService.GetAssessmentVersionDefine(mProductionID, mWorkingSectionID);
            string json = EasyUIJsonParser.DataGridJsonParser.DataTableToJson(table);
            return json;
        }
        /// <summary>
        /// 添加操作
        /// </summary>
        /// <param name="mProductionID"></param>
        /// <param name="mWorkingSectionID"></param>
        /// <param name="mName"></param>
        /// <param name="mType"></param>
        /// <param name="mCreator"></param>
        /// <param name="mRemark"></param>
        /// <param name="mIsAdd"></param>
        /// <returns></returns>
         [WebMethod]
        public static int AddAssessmentVersion(string mProductionID, string mWorkingSectionID, string mName, string mType, string mCreator, string mRemark) 
         //mProductionID,mWorkingSectionID,mName,mType,mCreator,mRemark,mIsAdd              
        {
            int result = AssessmentVersionDefineService.ToAddAssessmentVersion( mProductionID, mWorkingSectionID, mName, mType, mCreator, mRemark);
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
        /// <param name="mIsAdd"></param>
        /// <returns></returns>
         [WebMethod]
         public static int EditAssessmentVersion(string mProductionID, string mWorkingSectionID, string mName, string mType, string mCreator, string mRemark, string mKeyId)
         //mProductionID,mWorkingSectionID,mName,mType,mCreator,mRemark,mIsAdd              
         {
             int result = AssessmentVersionDefineService.ToEditAssessmentVersion(mProductionID, mWorkingSectionID, mName, mType, mCreator, mRemark, mKeyId);
             return result;
         }
        [WebMethod]
         public static string GetAssessmentVersionDetail(string mKeyId)
        {
            DataTable table = AssessmentVersionDefineService.GetAssessmentVersionDetailTable(mKeyId);
            string json = EasyUIJsonParser.DataGridJsonParser.DataTableToJson(table);
            return json;       
        }
        [WebMethod]
        public static string GetAssessmentCatalogue()
        {
            DataTable table = commonClass.GetAssessmentCatalogueTable();
            string json = EasyUIJsonParser.DataGridJsonParser.DataTableToJson(table);
            return json;         
         }
        [WebMethod]
        public static int SaveGetAssessmentDetail(string mOrganizationID, string mKeyId, string mAssessmentId, string mObjectId, string mWeightedValue, string mBestValue, string mWorstValue, string mEnabled)
        {
            int result = AssessmentVersionDefineService.ToAddAssessmentDetail(mOrganizationID,mKeyId,mAssessmentId,mObjectId,mWeightedValue,mBestValue,mWorstValue,mEnabled);
            return result;      
        }
        [WebMethod]
        public static int UptateGetAssessmentDetail(string mOrganizationID, string mKeyId, string mAssessmentId, string mObjectId, string mWeightedValue, string mBestValue, string mWorstValue, string mEnabled, string mId) 
        {
            int result = AssessmentVersionDefineService.ToEditAssessmentDetail(mOrganizationID, mKeyId, mAssessmentId, mObjectId, mWeightedValue, mBestValue, mWorstValue, mEnabled, mId);
            return result;       
        }
        [WebMethod]
        public static int DeleteAssessmentDetail(string mId)
        {
            int result = AssessmentVersionDefineService.ToDeleteAssessmentDetail(mId);
            return result;   
        }
        [WebMethod] 
        public static int DeleteAssessmentVersion(string mKeyId)
        {
            int result = AssessmentVersionDefineService.ToDeleteAssessmentVersion(mKeyId);
            return result;          
        }
    }
}