using StaffAssessment.Service;
using StaffAssessment.Service.WorkingSection;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Services;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace StaffAssessment.Web.UI_WorkingSection
{
    public partial class WorkingSectionDefine : WebStyleBaseForEnergy.webStyleBase
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
               // this.OrganisationTree_ProductionLine.LeveDepth = 7;
#elif RELEASE
#endif
                this.OrganisationTree_ProductionLine.Organizations = GetDataValidIdGroup("ProductionOrganization");                         //向web用户控件传递数据授权参数
                this.OrganisationTree_ProductionLine.PageName = "StaffSignInModify.aspx";   //向web用户控件传递当前调用的页面名称
                this.OrganisationTree_ProductionLine.LeveDepth = 7;
            }
        }
        [WebMethod]
        public static string GetQueryData(string mOrganizationId)
        {
            DataTable table = WorkingSectionDefineService.GetQueryDataTable(mOrganizationId);
            string json = EasyUIJsonParser.DataGridJsonParser.DataTableToJson(table);
            return json;         
        }
        [WebMethod]
        public static string GetProductionNameList(string mOrganizationID)
        {
            DataTable table = commonClass.GetProductionNameList(mOrganizationID);
            string[] para={"OrganizationID","text"};
            string json = EasyUIJsonParser.TreeGridJsonParser.DataTableToJsonByLevelCode(table, "LevelCode", para);
            return json;   
        }
        [WebMethod]
        public static int AddWorkingSection(string mProductionName ,string mSectionType,string mWorkingSection,string mEnabed,string mEditor,string mRemark)
        {
            //DataTable table = commonClass.GetProductionNameList(mOrganizationID);
            //string[] para = { "OrganizationID", "text" };
            //string json = EasyUIJsonParser.TreeGridJsonParser.DataTableToJsonByLevelCode(table, "LevelCode", para);
            int result = WorkingSectionDefineService.InsertWorkingSection( mProductionName , mSectionType, mWorkingSection, mEnabed, mEditor, mRemark);
            return result;         
        }
        [WebMethod]
        public static int EditWorkingSection(string mWorkingSectionID,string mProductionName, string mSectionType, string mWorkingSection, string mEnabed, string mEditor, string mRemark)
        {
            int result = WorkingSectionDefineService.EditWorkingSection(mWorkingSectionID,mProductionName, mSectionType, mWorkingSection, mEnabed, mEditor, mRemark);
            return result;     
        }
        [WebMethod]
        public static int deleteWorkingSection(string mWorkingSectionID) 
        {
            int result = WorkingSectionDefineService.deleteWorkingSection(mWorkingSectionID);
            return result;  
        }
    }
}