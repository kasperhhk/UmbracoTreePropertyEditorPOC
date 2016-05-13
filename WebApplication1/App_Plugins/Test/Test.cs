using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Umbraco.Core.PropertyEditors;

namespace WebApplication1.App_Plugins.Test
{
    [PropertyEditor("NCTest", "NCTest", "/App_Plugins/Test/test.html", ValueType = "JSON")]
    public class Test
    {
        public class Prevalue : PreValueEditor
        {
            [PreValueField("NCTestPrevalue", "Datatype", "/App_Plugins/Test/test.datatype.html", Description = "Select datatype")]
            public int DatatypeId { get; set; }
        }
    }
}