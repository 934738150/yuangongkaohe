//用于查询
var mOrganizationId = "";
var mWorkingSectionID = "";
var mProductionID = "";
//
var IsAdd = true;
//用于添加和编辑
var eName = "";
var eType = "";
var eProductionID = "";
var eWorkingSectionID = "";
var eRemark = "";
var eCreator = "";
//
var eKeyId = "";
var meditContrastId = "";
////用于考核详细表的增加和编辑
var eAssessmentObjectId = "";
var eObjectId = "";
var eWeightedValue = "";
var eBestValue = "";
var eWorstValue = "";
var eEnabled = "";

var IsAddDetail = true;
var eId = "";
$(document).ready(function () {
    LoadMainDataGrid("first");
    LoadMainDataGridDetail("first");
    LoadAssessmentCatalogue();
});
function onOrganisationTreeClick(node) {
    $('#organizationName').textbox('setText', node.text);
    mOrganizationId = node.OrganizationId;
    LoadWorkingSectionGrid(mOrganizationId);
}
function LoadAssessmentCatalogue() {
    $.ajax({
        type: "POST",
        url: "AssessmentVersionDefine.aspx/GetAssessmentCatalogue",
        data: "",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg) {
            var myData = jQuery.parseJSON(msg.d);
            $('#eAssessmentObject').combobox({
                panelHeight: 'auto',
                valueField: 'AssessmentId',
                textField: 'Name',
                data: myData.rows,
                onSelect: function (index, row) {
                   // row.AssessmentId;

                    //mProductionID = row.OrganizationID;
                    //mWorkingSectionID = row.WorkingSectionID;
                    //var mProductionName = row.OrganizationName;  //产线名称
                    //$('#productionName').textbox('setText', mProductionName);
                }
            });
        },
        error: function () {
            LoadMainDataGridDetail("last", []);
            $.messager.alert('提示', '加载失败！');
        }
    });
}
function LoadWorkingSectionGrid(mValue) {
    $.ajax({
        type: "POST",
        url: "AssessmentVersionDefine.aspx/GetWorkingSectionGrid",
        data: " {mOrganizationId:'" + mValue + "'}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg) {
            var myData = jQuery.parseJSON(msg.d);
            $('#workingSection').combogrid({
                panelWidth: '182px',
                panelHeight: 'auto',
                idField: 'WorkingSectionID',
                textField: 'WorkingSectionName',
                columns: [[
                    { field: 'WorkingSectionID', title: '', width: 60, hidden: true },
                    { field: 'WorkingSectionName', title: '岗位名称', width: 80 },
                    { field: 'OrganizationName', title: '产线', width: 100 }
                ]],
                data: myData,
                onSelect: function (index, row) {
                    mProductionID = row.OrganizationID;
                    mWorkingSectionID = row.WorkingSectionID;  
                    var mProductionName = row.OrganizationName;  //产线名称
                    $('#productionName').textbox('setText', mProductionName);                 
                }
            });
            $('#eWorkingSection').combogrid({
                panelWidth: '182px',
                panelHeight: 'auto',
                idField: 'WorkingSectionID',
                textField: 'WorkingSectionName',
                columns: [[
                    { field: 'WorkingSectionID', title: '', width: 60, hidden: true },
                    { field: 'WorkingSectionName', title: '岗位名称', width: 80 },
                    { field: 'OrganizationName', title: '产线', width: 100 }
                ]],
                data: myData,
                onSelect: function (index, row) {
                    eProductionID = row.OrganizationID;
                    eWorkingSectionID = row.WorkingSectionID;
                    var eProductionName = row.OrganizationName;  //产线名称
                    $('#eProductionName').textbox('setText', eProductionName);                  
                }
            });
        },
        error: function () {
            $("#grid_Main").datagrid('loadData', []);
            $.messager.alert('失败', '加载失败！');
        }
    });
}

function Query() {
    if (mOrganizationId == "" ) {
        $.messager.alert('提示', '请选择组织机构！');
    } else {
        var mUrl = "";
        var mData = "";
        if (mProductionID == "") {
            //按组织机构进行查询
            mUrl = "AssessmentVersionDefine.aspx/GetAssessmentVersionDefineByOrganization";
            mData = " {mOrganizationId:'" + mOrganizationId+ "'}";
        }
        else {
            //按岗位和产线进行查询
            mUrl = "AssessmentVersionDefine.aspx/GetAssessmentVersionDefineByWorkingSection";
            mData = " {mProductionID:'" + mProductionID + "',mWorkingSectionID:'" + mWorkingSectionID  + "'}";
        }
        $.ajax({
                type: "POST",
                url: mUrl,
                data: mData,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (msg) {
                    var myData = jQuery.parseJSON(msg.d);
                    if (myData.total == 0) {
                        LoadMainDataGrid("last", []);
                        $.messager.alert('提示', '未查询到考核版本！');
                    } else {
                        LoadMainDataGrid("last", myData);
                    }
                },
                error: function () {
                    LoadMainDataGrid("last", []);
                    $.messager.alert('提示', '加载失败！');
                }
            });
    }
}
function LoadMainDataGrid(type, myData) {
    if (type == "first") {
        $('#grid_Main').datagrid({
            columns: [[
                    { field: 'Name', title: '考核名称', width: 120 },
                    { field: 'OrganizationName', title: '产线', width: 100 },
                    { field: 'WorkingSectionName', title: '岗位', width: 80, align: 'center' },
                    { field: 'Type', title: '考核类型', width: 60, align: 'center' },
                    { field: 'Creator', title: '编辑人', width: 65, align: 'center' },
                    { field: 'CreateTime', title: '编辑时间', width: 120 },
                    { field: 'Remark', title: '备注', width: 120 },
                    {
                        field: 'edit', title: '编辑', width: 100, formatter: function (value, row, index) {
                            var str = "";
                            str = '<a href="#" onclick="editFun(true,\'' + row.KeyId + '\')"><img class="iconImg" src = "/lib/extlib/themes/images/ext_icons/notes/note_edit.png" title="编辑页面" onclick="editFun(true,\'' + row.KeyId + '\')"/>编辑</a>';
                            str = str + '<a href="#" onclick="deleteFun(\'' + row.KeyId + '\')"><img class="iconImg" src = "/lib/extlib/themes/images/ext_icons/notes/note_delete.png" title="删除页面"  onclick="deleteFun(\'' + row.KeyId + '\')"/>删除</a>';
                            //str = str + '<img class="iconImg" src = "/lib/extlib/themes/images/ext_icons/notes/note_delete.png" title="删除页面" onclick="DeletePageFun(\'' + row.id + '\');"/>删除';
                            return str;
                        }
                    },
                    {
                        field: 'reserch', title: '查询考核项', width: 100,align:'center', formatter: function (value, row, index) {
                            return '<a href="#" onclick="reserchFun(\'first\',\'' + row.KeyId + '\')"><img class="iconImg" src = "/lib/ealib/themes/icons/search.png" title="查看" onclick="reserchFun(\'first\',\'' + row.KeyId  + '\')"/>查看</a>';
                        }
                    }

            ]],
            fit: true,
            toolbar: "#toorBar",
            idField: 'KeyId',
            rownumbers: true,
            singleSelect: true,
            striped: true,
            data: [],
            onClickRow: function (index, row) {
                reserchFun("first", row.KeyId, row.Name);
            }
        });
    }
    else {
        $('#grid_Main').datagrid('loadData', myData);
    }
}
function LoadMainDataGridDetail(type, myData) {
    if (type == "first") {
        $('#grid_MainDetail').datagrid({
            columns: [[
                    { field: 'Name', title: '考核项', width: 100 },
                    { field: 'ObjectId', title: '考核元素', width: 120 },
                    { field: 'WeightedValue', title: '权重', width: 60, align: 'center' },
                    { field: 'BestValue', title: '最好值', width: 60, align: 'center' },
                    { field: 'WorstValue', title: '最差值', width: 60, align: 'center' },
                    {
                        field: 'Enabled', title: '启用标志', width: 80, align: 'center', formatter: function (value, row, index) {
                            if (value==1) {return value = "是";} else if (value == 0) { return value = "否"; }
                        }
                    },
                    {
                        field: 'edit', title: '编辑', width: 100, align: 'center', formatter: function (value, row, index) {
                            var str = "";
                            str = '<a href="#" onclick="editDetailFun(true,\'' + row.Id + '\')"><img class="iconImg" src = "/lib/extlib/themes/images/ext_icons/notes/note_edit.png" title="编辑页面" onclick="editDetailFun(true,\'' + row.Id + '\')"/>编辑</a>';
                            str = str + '<a href="#" onclick="deleteDetailFun(\'' + row.Id + '\')"><img class="iconImg" src = "/lib/extlib/themes/images/ext_icons/notes/note_delete.png" title="删除页面"  onclick="deleteDetailFun(\'' + row.Id + '\')"/>删除</a>';
                            //str = str + '<img class="iconImg" src = "/lib/extlib/themes/images/ext_icons/notes/note_delete.png" title="删除页面" onclick="DeletePageFun(\'' + row.id + '\');"/>删除';
                            return str;
                        }
                    }

            ]],
            fit: true,
            toolbar: "#toorBarDetail",
            idField: 'Id',
            rownumbers: true,
            singleSelect: true,
            striped: true,
            data: []
        });
    }
    else {
        $('#grid_MainDetail').datagrid('loadData', myData);
    }
}
function save()
{
   // eKeyId  用于编辑
  //  eWorkingSectionID = "";
  //  eProductionID = "";
    eName = $('#eAssessmentName').textbox('getText');
    eType = $('#eAssessmentype').textbox('getText');
    eCreator = $('#editor').textbox('getText');
    eRemark = $('#eRemark').textbox('getText');
    if (eWorkingSectionID == "") {
        $.messager.alert('提示', '请选择岗位！');
    } else {
        if (eName == "" || eType == "" || eCreator == "") {
            $.messager.alert('提示', '请填写未填项！');
        }
        else {
            var mUrl = "";
            var mData = "";
            if (IsAdd) {
                mUrl="AssessmentVersionDefine.aspx/AddAssessmentVersion";
                mData = " {mProductionID:'" + eProductionID + "',mWorkingSectionID:'" + eWorkingSectionID + "',mName:'" + eName + "',mType:'" + eType + "',mCreator:'" + eCreator + "',mRemark:'" + eRemark  + "'}";
            } else {
                mUrl = "AssessmentVersionDefine.aspx/EditAssessmentVersion";
                mData = " {mProductionID:'" + eProductionID + "',mWorkingSectionID:'" + eWorkingSectionID + "',mName:'" + eName + "',mType:'" + eType + "',mCreator:'" + eCreator + "',mRemark:'" + eRemark + "',mKeyId:'" + eKeyId + "'}";
            }
            $.ajax({
                type: "POST",
                url: mUrl,
                data:mData,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (msg) {
                    var myData = msg.d;
                    if (myData >= 1) {
                        if (IsAdd) {
                            $.messager.alert('提示', '添加成功！');
                        } else {
                            $.messager.alert('提示', '编辑成功！');
                        }                   
                    } else {
                        $.messager.alert('提示', '操作失败！');
                    }
                    $('#AddandEditor').window('close');
                    refreshFun();
                },
                error: function () {
                    $.messager.alert('提示', '操作失败！');
                }
            });
        }
    }
}
function addFun() {
    editFun(false);
}
function refreshFun() {
    Query();
}
function editFun(IsEdit, editContrastId) {
      // A.[KeyId]
      //,A.[Name]
      //,A.[Type]
	  //,B.[Name] as [OrganizationName]
      //,A.[OrganizationID]
	  //,C.[WorkingSectionName]
      //,A.[WorkingSectionID]
      //,A.[Remark]
      //,A.[Creator]
    //,A.[CreateTime]   

    if (IsEdit) {
        IsAdd = false;  //编辑
        $('#grid_Main').datagrid('selectRecord', editContrastId);
        var data = $('#grid_Main').datagrid('getSelected');
        // 1.页面显示  2 定义参数

        eKeyId = editContrastId;
        $('#eWorkingSection').combogrid('setText', data.WorkingSectionName);
        eWorkingSectionID = data.WorkingSectionID;
        $('#eProductionName').textbox('setText', data.OrganizationName);
        eProductionID = data.OrganizationID;
        $('#eAssessmentName').textbox('setText', data.Name);
        eName = data.Name;
        $('#eAssessmentype').textbox('setText', data.Type);
        eType = data.Type;
        $('#editor').textbox('setText', data.Creator);
        eCreator = data.Creator;
        $('#eRemark').textbox('setText', data.Remark);
        eRemark = data.Remark;

        //var eName = "";
        //var eType = "";
        //var eProductionID = "";
        //var eWorkingSectionID = "";
        //var eRemark = "";
        //var eCreator = "";

    }
    else {
        IsAdd = true; //添加
        //初始化     1.页面显示的初始化 2 参数的初始化
        $('#eWorkingSection').combogrid('setText', "");
        $('#eProductionName').textbox('setText', "");  
        $('#eAssessmentName').textbox('setText', "");
        $('#eAssessmentype').textbox('setText', "");  
        $('#editor').textbox('setText', "");
        $('#eRemark').textbox('setText', "");
        eWorkingSectionID = "";
        eProductionID = "";
        eName = "";
        eType = "";
        eCreator = "";
        eRemark = "";
        if (mOrganizationId == "" && mOrganizationId == undefined) {
            $.messager.alert('提示', '请选择组织机构！');
        }
    }
    $('#AddandEditor').window('open');
}
function deleteFun(editContrastId) {
    if (editContrastId != "") {
        $.messager.confirm('提示', '确定要删除该考核版本及该版本下的所有考核项？', function (r) {
            if (r) {
                $.ajax({
                    type: "POST",
                    url: "AssessmentVersionDefine.aspx/DeleteAssessmentVersion",
                    data: "{mKeyId:'" + editContrastId + "'}",
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (msg) {
                        var myData = msg.d;
                        if (myData >= 1) {
                            $.messager.alert('提示', '删除成功！');
                        } else {
                            $.messager.alert('提示', '删除失败！');
                        }
                        refreshFun();
                    },
                    error: function () {
                        $.messager.alert('提示', '操作失败！');
                    }
                });
            }
        });
    }else {
        $.messager.alert('提示', '请选择考核项！');
    }     
}
var myOrganizationId = "";
function reserchFun(type, editContrastId) {
    meditContrastId = editContrastId;
    if (type == "first") {
        $('#grid_Main').datagrid('selectRecord', editContrastId);
        var data = $('#grid_Main').datagrid('getSelected');
        $('#assessmentName').textbox('setText', data.Name);
        myOrganizationId = data.OrganizationID;
    }
    $.ajax({
        type: "POST",
        url: "AssessmentVersionDefine.aspx/GetAssessmentVersionDetail",
        data: " {mKeyId:'" + editContrastId + "'}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg) {
            var myData = jQuery.parseJSON(msg.d);
            if (myData.total == 0) {
                LoadMainDataGridDetail("last", []);
                $.messager.alert('提示', '请添加考核项目！');
            } else {
                LoadMainDataGridDetail("last", myData);
            }
        },
        error: function () {
            $.messager.alert('提示', '加载失败！');
        }
    });
}

function addDetailFun() {
    editDetailFun(false);
}
function refreshDetailFun() {
     var myKeyId= meditContrastId;
     reserchFun("last",myKeyId);
}
function deleteDetailFun(editContrastId) {
    //删除考核项
    $.ajax({
        type: "POST",
        url: "AssessmentVersionDefine.aspx/DeleteAssessmentDetail",
        data: "{mId:'" + editContrastId + "'}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg) {
            var myData = msg.d;
            if (myData >= 1) {
                    $.messager.alert('提示', '删除成功！');
            } else {
                $.messager.alert('提示', '删除失败！');
            }
            refreshDetailFun();
        },
        error: function () {
            $.messager.alert('提示', '操作失败！');
        }
    });

}
function editDetailFun(IsEdit, editContrastId) {
    if (IsEdit) {
        IsAddDetail = false;  //编辑
        $('#grid_MainDetail').datagrid('selectRecord', editContrastId);
        var data = $('#grid_MainDetail').datagrid('getSelected');
        //
        eId = data.Id;
        $('#eAssessmentObject').combobox('setText', data.Name);
        eAssessmentObjectId = data.AssessmentId;
        $('#eAssessment').textbox('setText', data.ObjectId);
        eObjectId = data.ObjectId;
        $('#eWeightedValue').numberbox('setValue', data.WeightedValue);
        eWeightedValue = data.WeightedValue;
        $('#eBestValue').numberbox('setValue', data.BestValue);
        eBestValue = data.BestValue;
        $('#eWorstValue').numberbox('setValue', data.WorstValue);
        eWorstValue = data.WorstValue;
        $('#eEnabled').combobox('setValue', data.Enabled);
        eEnabled = data.Enabled;
    } else {
        IsAddDetail = true;
        //初始化
        $('#eAssessmentObject').combobox('setText', "");
        eAssessmentObjectId = "";
        $('#eAssessment').textbox('setText',"");
        eObjectId ="";
        $('#eWeightedValue').numberbox('setValue', "");
        eWeightedValue = "";
        $('#eBestValue').numberbox('setValue',"");
        eBestValue = "";
        $('#eWorstValue').numberbox('setValue',"");
        eWorstValue = "";
        $('#eEnabled').combobox('setValue',1);
        eEnabled = 1;
        if (meditContrastId == "") {
            $.messager.alert('提示', '请选择考核项！');
        }
    }
    $('#AddandEditorDetail').window('open');
}
function saveDetail() {

   // myOrganizationId   meditContrastId
    //eAssessmentObject  combobox
    //获取参数
    eAssessmentObjectId = $('#eAssessmentObject').combobox('getValue');
    //eAssessment   textbox
    eObjectId = $('#eAssessment').textbox('getText');
    //eWeightedValue  numberbox
    eWeightedValue = $('#eWeightedValue').numberbox('getValue');
    //eBestValue numberbox
    eBestValue = $('#eBestValue').numberbox('getValue');
    //eWorstValue  numberbox
    eWorstValue = $('#eWorstValue').numberbox('getValue');
    //eEnabled  combobox
    eEnabled = $('#eEnabled').combobox('getValue');
    if (meditContrastId == "") {
        $.messager.alert('提示', '请选择考核项！');
    } else {
        if (eAssessmentObjectId == "" || eObjectId == "" || eWeightedValue == "" || eBestValue == "" || eWorstValue == "" || eEnabled == "") {
            $.messager.alert('提示', '请选择未填项！');
        }
        var mUrl = "";
        var mData = "";
        if (IsAddDetail) {
            mUrl = "AssessmentVersionDefine.aspx/SaveGetAssessmentDetail";
            mData = "{mOrganizationID:'" + myOrganizationId + "',mKeyId:'" + meditContrastId + "',mAssessmentId:'" + eAssessmentObjectId + "',mObjectId:'" + eObjectId + "',mWeightedValue:'" + eWeightedValue + "',mBestValue:'" + eBestValue + "',mWorstValue:'" + eWorstValue + "',mEnabled:'" + eEnabled + "'}";
        } else {
            mUrl = "AssessmentVersionDefine.aspx/UptateGetAssessmentDetail";
            mData = "{mOrganizationID:'" + myOrganizationId + "',mKeyId:'" + meditContrastId + "',mAssessmentId:'" + eAssessmentObjectId + "',mObjectId:'" + eObjectId + "',mWeightedValue:'" + eWeightedValue + "',mBestValue:'" + eBestValue + "',mWorstValue:'" + eWorstValue + "',mEnabled:'" + eEnabled + "',mId:'" + eId + "'}";
        }
        $.ajax({
            type: "POST",
            url: mUrl,
            data: mData,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (msg) {
                var myData = msg.d;
                if (myData >= 1) {
                    if (IsAddDetail) {
                        $.messager.alert('提示', '添加成功！');
                    } else {
                        $.messager.alert('提示', '编辑成功！');
                    }
                } else {
                    $.messager.alert('提示', '操作失败！');
                }
                $('#AddandEditorDetail').window('close');
                refreshDetailFun();
            },
            error: function () {
                $.messager.alert('提示', '操作失败！');
            }
        });
    }
 
}

